<?php
/**
 * AL SHAHAD SAE COMMERCIAL — معالج نماذج التواصل وطلب عرض السعر
 * يرسل الطلب إلى بريد الشركة + يحفظ نسخة احتياطية في ملف CSV
 * حتى لا يضيع أي عميل محتمل إذا تعطّل البريد.
 */

declare(strict_types=1);

// ————— الإعدادات —————
// البريد الذي تصلك عليه الطلبات. يمكن وضع أكثر من عنوان.
// لإيقاف نسخة الجيميل الاحتياطية: احذف السطر الخاص بها فقط.
const MAIL_TO = [
    'info@alshahad.net',            // الأساسي
    'Alshahad.ezz@gmail.com',       // نسخة احتياطية — احذف هذا السطر متى شئت
];

// عنوان المُرسِل. لا بد أن يكون صندوقاً حقيقياً على نطاق alshahad.net
// حتى تمرّ فحوصات SPF ولا تذهب الرسائل إلى السبام.
const MAIL_FROM = 'info@alshahad.net';

const SITE_NAME = 'بحر الشهد';
const LEADS_DIR    = __DIR__ . '/leads';
const RATE_SECONDS = 20;                        // أقل فاصل بين إرسالين من نفس الزائر

header('Content-Type: application/json; charset=utf-8');

function reply(bool $ok, string $message = '', int $code = 200): never {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reply(false, 'طريقة الطلب غير مدعومة.', 405);
}

// ————— مصيدة السبام —————
// الحقل website مخفي بالكامل عن المستخدم، فلا يملؤه إلا الروبوت.
if (!empty($_POST['website'])) {
    reply(true); // نرد بنجاح كاذب حتى لا يعرف الروبوت أنه كُشف
}

// ————— تحديد المعدل —————
session_start();
$now = time();
if (isset($_SESSION['last_submit']) && ($now - $_SESSION['last_submit']) < RATE_SECONDS) {
    reply(false, 'يرجى الانتظار قليلاً قبل إرسال طلب جديد.', 429);
}

// ————— قراءة الحقول وتنظيفها —————
function field(string $key, int $max = 500): string {
    $v = trim((string)($_POST[$key] ?? ''));
    $v = str_replace(["\r", "\n", "\0"], ' ', $v);   // منع حقن ترويسات البريد
    return mb_substr($v, 0, $max);
}

$formType = in_array($_POST['form_type'] ?? '', ['contact', 'quote'], true)
    ? $_POST['form_type'] : 'contact';

$name  = field('name', 120);
$phone = field('phone', 40);
$email = field('email', 160);

if ($name === '' || $phone === '') {
    reply(false, 'الاسم ورقم الجوال مطلوبان.', 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(false, 'البريد الإلكتروني غير صحيح.', 422);
}

$SERVICES = [
    'contracting' => 'المقاولات',
    'realestate'  => 'الخدمات العقارية',
    'marketing'   => 'التسويق العقاري',
    'other'       => 'أخرى',
];

if ($formType === 'quote') {
    $subject = 'طلب عرض سعر جديد من الموقع';
    $rows = [
        'نوع الخدمة' => $SERVICES[$_POST['service'] ?? ''] ?? 'غير محدد',
        'الاسم'       => $name,
        'الجوال'      => $phone,
        'البريد'      => $email,
        'المدينة'     => field('city', 80),
        'الميزانية'   => field('budget', 80),
        'المدة'       => field('timeline', 80),
        'التفاصيل'    => trim((string)($_POST['details'] ?? '')),
    ];
} else {
    $subject = 'رسالة جديدة من نموذج التواصل';
    $rows = [
        'الاسم'    => $name,
        'الجوال'   => $phone,
        'البريد'   => $email,
        'الموضوع'  => field('subject', 160),
        'الرسالة'  => trim((string)($_POST['message'] ?? '')),
    ];
}

// مصدر الطلب: يميّز عملاء الإعلانات المدفوعة عن زوار الموقع العاديين
$source = field('source', 60);
$rows['المصدر']       = $source !== '' ? $source : 'الموقع';
$rows['صفحة الإرسال'] = field('page_url', 300);
$rows['وقت الإرسال']  = date('Y-m-d H:i:s');
$rows['IP']           = $_SERVER['REMOTE_ADDR'] ?? '';

// نضيف المصدر لعنوان الرسالة ليتضح من الوارد مباشرةً
if ($source !== '') {
    $subject .= ' (' . $source . ')';
}

// ————— النسخة الاحتياطية (تُكتب قبل الإرسال) —————
$saved = false;
if (!is_dir(LEADS_DIR)) {
    @mkdir(LEADS_DIR, 0750, true);
}
if (is_dir(LEADS_DIR) && is_writable(LEADS_DIR)) {
    $file   = LEADS_DIR . '/leads-' . date('Y-m') . '.csv';
    $isNew  = !file_exists($file);
    if ($fh = @fopen($file, 'a')) {
        if (flock($fh, LOCK_EX)) {
            if ($isNew) {
                fwrite($fh, "\xEF\xBB\xBF");            // BOM ليفتح صحيحاً في Excel
                fputcsv($fh, ['النوع', ...array_keys($rows)]);
            }
            fputcsv($fh, [$formType, ...array_values($rows)]);
            $saved = true;
            flock($fh, LOCK_UN);
        }
        fclose($fh);
    }
}

// ————— إرسال البريد —————
$lines = [];
foreach ($rows as $label => $value) {
    if ($value !== '') {
        $lines[] = $label . ': ' . $value;
    }
}
$body = implode("\n", $lines);

$headers = [
    'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject . ' — ' . $name) . '?=';
$sent = @mail(implode(', ', MAIL_TO), $encodedSubject, $body, implode("\r\n", $headers));

$_SESSION['last_submit'] = $now;

// نعتبر العملية ناجحة إذا وصل الطلب بالبريد أو حُفظ في الملف الاحتياطي.
if ($sent || $saved) {
    reply(true, 'تم استلام طلبك بنجاح.');
}

reply(false, 'تعذّر إرسال الطلب حالياً.', 500);

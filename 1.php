<?

$a = $_POST['a'];
header('Content-Type: text/html; charset=utf-8');
$mosConfig_locale = 'RU';
DEFINE(_ADM_KA_LOCALE, 'ru_RU');
setlocale (LC_ALL, $mosConfig_locale.'UTF8', _ADM_KA_LOCALE.'UTF8', $mosConfig_locale.'UTF-8', _ADM_KA_LOCALE.'UTF-8');

$filename = 'js/lots.json';



if (is_writable($filename)) {

    
    if (!$handle = fopen($filename, 'a')) {
         echo "Не могу открыть файл ($filename)";
         exit;
    }
file_put_contents($filename, '');
   
    if (fwrite($handle, $a) === FALSE) {
        echo "Не могу произвести запись в файл ($filename)";
        exit;
    }
    
    echo "Ура! Записали в файл ($filename)";
    
    fclose($handle);

} else {
    echo "Файл $filename недоступен для записи";
}

?>


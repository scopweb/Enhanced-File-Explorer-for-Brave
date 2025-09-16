<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['url'])) {
    $url = trim($_POST['url']);
    $proxy = isset($_POST['proxy']) ? trim($_POST['proxy']) : '';
    
    // Validar que sea una URL
    if (filter_var($url, FILTER_VALIDATE_URL)) {
        // Usar cURL para descargar con proxy opcional
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Para evitar problemas SSL
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        // Si se proporciona proxy
        if (!empty($proxy)) {
            curl_setopt($ch, CURLOPT_PROXY, $proxy);
            // Si el proxy requiere autenticación, descomenta y configura:
            // curl_setopt($ch, CURLOPT_PROXYUSERPWD, 'usuario:password');
        }
        
        $imageData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($imageData !== false && $httpCode == 200) {
            // Obtener el nombre del archivo de la URL
            $filename = basename(parse_url($url, PHP_URL_PATH));
            
            // Si no tiene extensión, añadir .png por defecto
            if (!pathinfo($filename, PATHINFO_EXTENSION)) {
                $filename .= '.png';
            }
            
            // Guardar en la carpeta images/
            $filepath = __DIR__ . '/images/' . $filename;
            if (file_put_contents($filepath, $imageData)) {
                echo "<p style='color: green;'>Imagen descargada exitosamente como: $filename</p>";
            } else {
                echo "<p style='color: red;'>Error al guardar la imagen.</p>";
            }
        } else {
            echo "<p style='color: red;'>Error al descargar la imagen. Código HTTP: $httpCode. Verifica la URL o el proxy.</p>";
        }
    } else {
        echo "<p style='color: red;'>URL inválida.</p>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Descargar Imagen</title>
</head>
<body>
    <h1>Descargar Imagen desde URL</h1>
    <form method="post">
        <label for="url">URL de la imagen:</label><br>
        <input type="text" id="url" name="url" placeholder="https://ejemplo.com/imagen.png" required style="width: 300px;"><br><br>
        
        <label for="proxy">Proxy (opcional, ej: http://proxy.ejemplo.com:8080):</label><br>
        <input type="text" id="proxy" name="proxy" placeholder="http://usuario:pass@proxy.com:8080" style="width: 300px;"><br><br>
        
        <input type="submit" value="Descargar Imagen">
    </form>
    <p><strong>Nota:</strong> Si Fortinet bloquea la descarga, usa un proxy HTTP/SOCKS. Puedes buscar proxies gratuitos en línea, pero úsalos con precaución.</p>
</body>
</html>
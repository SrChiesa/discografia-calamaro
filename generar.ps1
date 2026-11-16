$carpetasConMusica = Get-ChildItem -Path ".\CALAMARO" -Directory -Recurse | Where-Object {
    (Get-ChildItem -Path $_.FullName -Filter *.mp3).Count -gt 0
}

$discos = foreach ($dir in $carpetasConMusica) {
    $rutaRelativa = $dir.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    $img = Get-ChildItem -Path $dir.FullName -Include *.jpg,*.jpeg,*.png -File | Select-Object -First 1
    $rutaImg = if ($img) { "$rutaRelativa/$($img.Name)" } else { "" }
    
    $temas = foreach ($mp3 in (Get-ChildItem -Path $dir.FullName -Filter *.mp3 -File)) {
        @{
            titulo = $mp3.BaseName -replace '^\d+[\s\-\.]*', ''
            archivo = "$rutaRelativa/$($mp3.Name)"
        }
    }

    @{
        id = $dir.Name
        titulo = $dir.Name -replace '^\d+[\s\-\.]*', ''
        anio = if ($dir.Name -match '\b(19\d\d|20\d\d)\b') { $matches[1] } else { "Discografía" }
        portada = $rutaImg
        canciones = @($temas)
    }
}

"const discografia = " + ($discos | ConvertTo-Json -Depth 4) + ";" | Out-File -FilePath ".\datos.js" -Encoding UTF8
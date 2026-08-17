$ErrorActionPreference = "Stop"

$origem = "C:\Users\GGABR\Downloads\fotos"
$destino = Join-Path $PSScriptRoot "fotos"

if (-not (Test-Path -LiteralPath $origem)) {
  Write-Host "Nao achei a pasta:"
  Write-Host "  $origem"
  Write-Host ""
  Write-Host "Confira se as fotos estao nesse caminho e rode de novo."
  exit 1
}

New-Item -ItemType Directory -Force -Path $destino | Out-Null

$arquivos = Get-ChildItem -LiteralPath $origem -File | Where-Object {
  $_.Extension -match '^\.(jpe?g|png|webp|heic)$'
} | Sort-Object Name, LastWriteTime

if ($arquivos.Count -eq 0) {
  Write-Host "A pasta existe, mas nao achei foto (.jpg, .png, .webp):"
  Write-Host "  $origem"
  exit 1
}

$n = 0
foreach ($arquivo in $arquivos) {
  $n += 1
  $ext = $arquivo.Extension.ToLower()
  if ($ext -eq ".jpeg") { $ext = ".jpg" }
  $alvo = Join-Path $destino ("{0}{1}" -f $n, $ext)
  Copy-Item -LiteralPath $arquivo.FullName -Destination $alvo -Force
  Write-Host ("  {0}  <-  {1}" -f (Split-Path $alvo -Leaf), $arquivo.Name)
}

Write-Host ""
Write-Host ("Pronto. {0} foto(s) copiada(s) para:" -f $n)
Write-Host "  $destino"
Write-Host ""
Write-Host "Agora abra o index.html para ver o site."
Write-Host "Se estiver bom, rode o subir-git.bat para enviar ao GitHub."

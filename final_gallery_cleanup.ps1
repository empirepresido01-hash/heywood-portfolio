$root = 'C:\Users\ffavo\Desktop\new portfolio vercel,google\public\picture slide'

foreach ($i in 1..20) {
    $name = 'slide' + $i
    $src = @('.jpg', '.jpeg', '.png') |
        ForEach-Object { $root + '\' + $name + $_ } |
        Where-Object { Test-Path $_ } |
        Select-Object -First 1

    if (-not $src) {
        continue
    }

    $out = $root + '\' + $name + '.webp'
    & 'C:\Python314\python.exe' -c "from PIL import Image; import sys; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], 'WEBP', quality=72, method=6, optimize=True)" $src $out

    foreach ($ext in @('.jpg', '.jpeg', '.png')) {
        $legacy = $root + '\' + $name + $ext
        if (Test-Path $legacy) {
            Remove-Item $legacy -Force
        }
    }

    Write-Output "converted $src -> $out"
}

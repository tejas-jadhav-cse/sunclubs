# Cleanup Script - Remove Unnecessary Optimization Files
# This script removes all files created during the optimization process

Write-Host "🧹 CLEANUP: Removing unnecessary optimization files..." -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Yellow
Write-Host ""

$filesRemoved = 0
$totalSizeFreed = 0

# 1. Remove HTML backup files
Write-Host "Removing HTML backup files..." -ForegroundColor Cyan
$htmlBackups = Get-ChildItem "*.backup-jquery" -ErrorAction SilentlyContinue
foreach ($file in $htmlBackups) {
    $size = $file.Length
    $totalSizeFreed += $size
    Remove-Item $file.FullName -Force
    Write-Host "  ✓ Removed: $($file.Name) ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
    $filesRemoved++
}

# 2. Remove CSS backup directories
Write-Host "`nRemoving CSS backup directories..." -ForegroundColor Cyan
$cssBackups = Get-ChildItem "css\backup-*" -Directory -ErrorAction SilentlyContinue
foreach ($dir in $cssBackups) {
    $size = (Get-ChildItem $dir.FullName -Recurse | Measure-Object -Property Length -Sum).Sum
    $totalSizeFreed += $size
    Remove-Item $dir.FullName -Recurse -Force
    Write-Host "  ✓ Removed directory: $($dir.Name) ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
    $filesRemoved++
}

# 3. Remove JavaScript backup directories
Write-Host "`nRemoving JavaScript backup directories..." -ForegroundColor Cyan
$jsBackups = Get-ChildItem "js\backup-*" -Directory -ErrorAction SilentlyContinue
foreach ($dir in $jsBackups) {
    $size = (Get-ChildItem $dir.FullName -Recurse | Measure-Object -Property Length -Sum).Sum
    $totalSizeFreed += $size
    Remove-Item $dir.FullName -Recurse -Force
    Write-Host "  ✓ Removed directory: $($dir.Name) ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
    $filesRemoved++
}

# 4. Remove purged CSS directory (since we reverted)
Write-Host "`nRemoving purged CSS directory..." -ForegroundColor Cyan
if (Test-Path "css\purged") {
    $size = (Get-ChildItem "css\purged" -Recurse | Measure-Object -Property Length -Sum).Sum
    $totalSizeFreed += $size
    Remove-Item "css\purged" -Recurse -Force
    Write-Host "  ✓ Removed directory: css\purged ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
    $filesRemoved++
}

# 5. Remove optimization scripts
Write-Host "`nRemoving optimization scripts..." -ForegroundColor Cyan
$scriptsToRemove = @(
    "apply-purged-css.ps1",
    "apply-conservative-purged-css.ps1", 
    "remove-jquery.ps1",
    "restore-jquery.ps1",
    "optimization-summary.ps1",
    "optimization-summary-simple.ps1"
)

foreach ($script in $scriptsToRemove) {
    if (Test-Path $script) {
        $size = (Get-Item $script).Length
        $totalSizeFreed += $size
        Remove-Item $script -Force
        Write-Host "  ✓ Removed: $script ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
        $filesRemoved++
    }
}

# 6. Remove optimization configuration files
Write-Host "`nRemoving optimization configuration files..." -ForegroundColor Cyan
$configsToRemove = @(
    "purgecss.config.js",
    "OPTIMIZATION_README.md"
)

foreach ($config in $configsToRemove) {
    if (Test-Path $config) {
        $size = (Get-Item $config).Length
        $totalSizeFreed += $size
        Remove-Item $config -Force
        Write-Host "  ✓ Removed: $config ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
        $filesRemoved++
    }
}

# 7. Clean up package.json scripts (remove optimization-related scripts)
Write-Host "`nCleaning up package.json scripts..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    $packageContent = Get-Content "package.json" -Raw
    $originalSize = $packageContent.Length
    
    # Remove optimization-related scripts
    $packageContent = $packageContent -replace ',\s*"purge-css":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"purge-css-main":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"purge-css-master":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"purge-all":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"apply-purged":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"apply-conservative":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"remove-jquery":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"restore-jquery":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"optimization-summary":[^,}]+', ''
    $packageContent = $packageContent -replace ',\s*"compare-sizes":[^,}]+', ''
    
    Set-Content "package.json" $packageContent -NoNewline
    $newSize = $packageContent.Length
    $sizeDiff = $originalSize - $newSize
    $totalSizeFreed += $sizeDiff
    Write-Host "  ✓ Cleaned package.json scripts ($([math]::Round($sizeDiff, 0)) bytes removed)" -ForegroundColor Green
}

# 8. Remove PurgeCSS dependency
Write-Host "`nRemoving PurgeCSS dependency..." -ForegroundColor Cyan
try {
    $npmOutput = npm uninstall purgecss 2>&1
    Write-Host "  ✓ Removed PurgeCSS from dependencies" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Could not remove PurgeCSS (may not be installed)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" -ForegroundColor Green
Write-Host "🎉 CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Cleanup Summary:" -ForegroundColor Cyan
Write-Host "  Files/Directories Removed: $filesRemoved" -ForegroundColor White
Write-Host "  Total Space Freed: $([math]::Round($totalSizeFreed/1KB, 2)) KB" -ForegroundColor White
Write-Host ""
Write-Host "✅ Removed Files:" -ForegroundColor Yellow
Write-Host "  - HTML backup files (*.backup-jquery)" -ForegroundColor White
Write-Host "  - CSS backup directories" -ForegroundColor White
Write-Host "  - JavaScript backup directories" -ForegroundColor White
Write-Host "  - Purged CSS directory" -ForegroundColor White
Write-Host "  - Optimization scripts" -ForegroundColor White
Write-Host "  - PurgeCSS configuration" -ForegroundColor White
Write-Host "  - Optimization documentation" -ForegroundColor White
Write-Host "  - Package.json optimization scripts" -ForegroundColor White
Write-Host "  - PurgeCSS dependency" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your repository is now clean and back to normal!" -ForegroundColor Green

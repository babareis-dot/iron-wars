# IRON WARS v10

Bu sürüm özellikle mobil tam ekran ve siyah kenar sorunlarını düzeltmek için sıfırdan temizlendi.

- Kullanıcının onayladığı üs görselindeki siyah yan barlar otomatik kırpıldı.
- Oyun `100dvw x 100dvh` alanı doldurur.
- Görsel `object-fit: cover` ile ekranı kenardan kenara kaplar.
- Tam ekran butonu hiçbir URL yönlendirmesi yapmaz.
- Fullscreen başarısız olursa aynı sayfada kalır ve uyarı gösterir.
- Desteklenen Android tarayıcılarda fullscreen sonrası `landscape` yön kilidi ister.
- Hafif duman, bina ışıkları, pist ışıkları, su parıltısı, servis aracı ve helikopter gölge hareketleri bulunur.
- Binalara dokunma ve seviye yükseltme korunur.
- Görselin kırpılan orijinal ölçüsü: 1536x674 -> 1191x674.

## GitHub
ZIP içindeki tüm dosyaları mevcut repo dosyalarının üzerine yükleyin:
- index.html
- style.css
- game.js
- README.md
- assets/iron-wars-base.jpg

ÖNEMLİ: Eski `assets/iron-wars-base.png` dosyası kalabilir ama v10 artık `.jpg` dosyasını kullanır.

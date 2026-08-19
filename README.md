# IRON WARS v17

Bu sürümde ekonomi ve bina geliştirme sistemi Delta Wars 5 benzeri tarayıcı RTS mantığına yaklaştırıldı.

## Yeni oyuncu başlangıç kaynakları
- Para: 0
- Çelik: 100.000
- Fuel: 50.000
- Bakır: 100.000
- Altın: 25.000

v17 yeni bir kayıt alanı kullanır. Bu nedenle v17'yi ilk açan oyuncu bu başlangıç değerleriyle başlar.

## 1 dakikalık üretim
Kaynak binasında `ÜRET • 01:00` düğmesine basılır.
- Ekranda 01:00 geri sayım görünür.
- Üretim kuyruğu görünür.
- Kaynak HER SANİYE üst bardaki gerçek kaynağa eklenir.
- 1 dakika sonunda üretim durur ve yeniden ÜRET'e basılması gerekir.

Örnek üretim:
- Çelik Fabrikası Lv.1: +2.500/sn
- Çelik Fabrikası Lv.2: +4.000/sn
- Bakır Tesisi Lv.1: +2.500/sn
- Bakır Tesisi Lv.2: +4.000/sn
- Fuel Lv.1: +1.500/sn
- Fuel Lv.2: +2.500/sn
- Altın Lv.1: +120/sn
- Altın Lv.2: +200/sn

Seviye yükseldikçe üretim her seviyede artmaya devam eder.

## Bina geliştirme
- Geliştirme para ile değil BAKIR ile yapılır.
- Maksimum bina seviyesi: 25.
- Lv.1 -> Lv.2: 50.000 Bakır
- Lv.2 -> Lv.3: 100.000 Bakır
- Lv.3 -> Lv.4: 300.000 Bakır
- Sonraki seviyelerde maliyet giderek yükselir.
- Geliştirme süreleri de seviyeye göre uzar.
  İlk seviyeler saniye/dakika, yüksek seviyeler saatler sürer.
- Geliştirme sırasında bina üzerinde geri sayım ve ilerleme göstergesi görünür.
- Seviye tamamlanınca üretim hızı otomatik yükselir.

## Para
Para bu sürümde üretim binasına bağlı değildir. Satın alma/mağaza ekonomisi için ayrılmıştır.

## Kayıt
Kaynaklar, bina seviyeleri, aktif üretimler ve aktif geliştirme süreleri cihazdaki localStorage'a kaydedilir.

## GitHub
ZIP içindeki tüm dosyaları yükleyin. Ana klasörde yeni `v17.js` bulunmalıdır.

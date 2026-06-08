const fs = require('fs');
const path = require('path');

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir);

const replacements = {
  'dyn-title-wanita': 'data?.wanita_panggilan',
  'dyn-title-pria': 'data?.pria_panggilan',
  'dyn-meta-wanita': 'data?.wanita_panggilan',
  'dyn-meta-pria': 'data?.pria_panggilan',
  'dyn-cover-wanita': 'data?.wanita_panggilan',
  'dyn-cover-pria': 'data?.pria_panggilan',
  'dyn-footer-wanita': 'data?.wanita_panggilan',
  'dyn-footer-pria': 'data?.pria_panggilan',
  'dyn-cover-name-wanita': 'data?.wanita_panggilan',
  'dyn-cover-name-pria': 'data?.pria_panggilan',
  'dyn-wanita-lengkap': 'data?.wanita_lengkap',
  'dyn-wanita-ortu': 'data?.wanita_ortu',
  'dyn-pria-lengkap': 'data?.pria_lengkap',
  'dyn-pria-ortu': 'data?.pria_ortu',
  'dyn-tanggal-cover': 'data?.tanggal_cover',
  'dyn-tanggal-lengkap': 'data?.tanggal_lengkap',
  'dyn-waktu-akad': 'data?.waktu_akad',
  'dyn-waktu-resepsi': 'data?.waktu_resepsi',
  'dyn-lokasi-akad': 'data?.lokasi_akad',
  'dyn-lokasi-resepsi': 'data?.lokasi_resepsi',
  'dyn-alamat-baris1': 'data?.alamat_baris1',
  'dyn-alamat-baris2': 'data?.alamat_baris2',
  'dyn-rek-nama-wanita': 'data?.wanita_lengkap',
  'dyn-rek-nama-pria': 'data?.pria_lengkap',
  'dyn-rekening-wanita': 'data?.rekening_wanita',
  'dyn-rekening-pria': 'data?.rekening_pria',
  'dyn-copy-wanita': 'data?.rekening_wanita',
  'dyn-copy-pria': 'data?.rekening_pria'
};

files.forEach(file => {
  if (!file.endsWith('.jsx')) return;
  let content = fs.readFileSync(path.join(componentsDir, file), 'utf8');

  // Replace <span id="dyn-*"></span> with {data?.field}
  content = content.replace(/<span id="(dyn-[^"]+)"><\/span>/g, (match, id) => {
    if (replacements[id]) {
      return `{${replacements[id]}}`;
    }
    return match;
  });
  
  // Fix inputs
  content = content.replace(/<input([^>]*?[^\/])>/g, '<input$1 />');
  
  // Fix imgs
  content = content.replace(/<img([^>]*?[^\/])>/g, '<img$1 />');
  
  // Fix <br>
  content = content.replace(/<br>/g, '<br />');

  // Special cases for Maps links
  content = content.replace(/href="#" className="dyn-link-maps"/g, 'href={data?.link_maps || "#"} className="dyn-link-maps"');
  
  // Special cases for copy buttons
  content = content.replace(/data-copy="<span id="([^"]+)"><\/span>"/g, (match, id) => {
    if (replacements[id]) {
      return `data-copy={${replacements[id]}}`;
    }
    return match;
  });

  fs.writeFileSync(path.join(componentsDir, file), content);
});

console.log("Fixed components.");

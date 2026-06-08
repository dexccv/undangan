const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('legacy/index.html', 'utf8');

function htmlToJsx(htmlStr) {
  let jsx = htmlStr;
  
  // Replace class= with className=
  jsx = jsx.replace(/class=/g, 'className=');
  // Replace for= with htmlFor=
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Replace HTML comments
  jsx = jsx.replace(/<!--(.*?)-->/gs, '{/*$1*/}');
  
  // Replace inline styles (basic parsing, might need manual tweak later but covers most)
  jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
    const styleObj = p1.split(';').filter(s => s.trim()).reduce((acc, style) => {
      let [key, value] = style.split(':');
      if (key && value) {
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc.push(`${key}: '${value.trim()}'`);
      }
      return acc;
    }, []).join(', ');
    return `style={{ ${styleObj} }}`;
  });

  return jsx;
}

const sections = [
  { id: 'cover', regex: /<section id="cover">(.*?)<\/section>/s, name: 'Cover' },
  { id: 'quotes', regex: /<section id="quotes">(.*?)<\/section>/s, name: 'Quotes' },
  { id: 'parents', regex: /<section id="parents">(.*?)<\/section>/s, name: 'Parents' },
  { id: 'countdown', regex: /<section id="countdown" className="section">(.*?)<\/section>/s, name: 'CountdownAndEvents' },
  { id: 'story', regex: /<section id="story" className="section">(.*?)<\/section>/s, name: 'Story' },
  { id: 'gallery', regex: /<section id="gallery" className="section">(.*?)<\/section>/s, name: 'Gallery' },
  { id: 'rsvp', regex: /<section id="rsvp" className="section" style={{ background: 'var(--cream)' }}>(.*?)<\/section>/s, name: 'RSVP' },
  { id: 'guestbook', regex: /<section id="guestbook" className="section">(.*?)<\/section>/s, name: 'Guestbook' },
  { id: 'gift', regex: /<section id="gift" className="section">(.*?)<\/section>/s, name: 'Gift' },
  { id: 'closing', regex: /<section id="closing">(.*?)<\/section>/s, name: 'Closing' }
];

const fullJsx = htmlToJsx(html);

sections.forEach(sec => {
  // We match the tag + content so we just wrap it
  // Actually, we can just extract from the fullJsx
  // Let's use simpler regex: just find <section id="id"... to </section>
  const match = fullJsx.match(new RegExp(`<section id="${sec.id}"[^>]*>([\\s\\S]*?)<\\/section>`));
  if (match) {
    const content = match[0];
    const componentCode = `import React from 'react';\n\nexport default function ${sec.name}({ data }) {\n  return (\n    ${content}\n  );\n}\n`;
    fs.writeFileSync(`src/components/${sec.name}.jsx`, componentCode);
  } else {
    console.log("Could not find section:", sec.id);
  }
});

console.log("Done generating components.");

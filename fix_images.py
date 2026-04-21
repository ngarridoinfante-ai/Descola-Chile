#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

# Leer el archivo
with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Diccionario de reemplazos para blog cards
blog_replacements = {
    'blog-travel large': "style=\"background-image: url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center;\"",
    'blog-food': "style=\"background-image: url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\"",
    'blog-ski': "style=\"background-image: url('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\"",
    'blog-shopping': "style=\"background-image: url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\"",
    'blog-agency': "style=\"background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\"",
    'blog-tips': "style=\"background-image: url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\"",
}

# Reemplazar blog cards
for class_name, style in blog_replacements.items():
    # Remover estilos anteriores mal colocados
    pattern = f'<article class="([^"]*{class_name}[^"]*)">\\s+style="[^"]*"'
    content = re.sub(pattern, f'<article class="\\1">', content)
    
    # Agregar el nuevo estilo
    pattern = f'<article class="([^"]*{class_name}[^"]*)">'
    content = re.sub(pattern, f'<article class="\\1" {style}>', content)

# Partner cards
partner_images = [
    ('featured', "style=\"background-image: url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\""),
]

# Remover estilos incorrectamente colocados de partner cards
content = re.sub(r'<article class="partner-card ([^"]*)">\s+style="[^"]*"', r'<article class="partner-card \1">', content)

# Agregar estilos a partner cards
pattern = r'<article class="partner-card featured">'
content = re.sub(pattern, f'<article class="partner-card featured" style="background-image: url(\'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80\'); background-size: cover; background-position: center;">', content)

# Las otras partner cards sin featured
pattern = r'<article class="partner-card">\s+style="[^"]*"'
content = re.sub(pattern, '<article class="partner-card">', content)

# Agregar diferent imágenes a las 3 partner cards restantes (no featured)
replacements_partner = [
    ("City Tour Chile", "style=\"background-image: url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\""),
    ("Neve & Ski", "style=\"background-image: url('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\""),
    ("Enoturismo Premium", "style=\"background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80'); background-size: cover; background-position: center;\""),
]

for title, style in replacements_partner:
    pattern = f'<h3>{re.escape(title)}</h3>'
    # Buscar el article que contenga este h3
    # Hacerlo de forma más segura
    match_pattern = f'(<article class="partner-card">)\\s*<h3>{re.escape(title)}'
    content = re.sub(match_pattern, f'\\1 {style}\n              <h3>{title}', content)

# Escribir el archivo
with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Archivo corregido exitosamente!")

# Use a imagem oficial do PHP 8.3 com FPM
FROM php:8.3-fpm

# Atualizar pacotes do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    nano \
    libzip-dev \
    libpq-dev

# Instalar extensões PHP necessárias para Laravel
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# Instalar Composer globalmente
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Criar diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do projeto
COPY . .

# Configurar permissões corretas
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expõe a porta 9000 para conexão com o Nginx
EXPOSE 9000

# Comando inicial do container
CMD ["php-fpm"]

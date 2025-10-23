"""
Modelos de cardápio para João Macarrão.
Gerenciamento de categorias e pratos.
"""
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Modelo de Categoria do cardápio.
    Ex: Massas, Molhos, Bebidas, etc.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Nome'
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        verbose_name='Slug'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descrição'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )
    
    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        """Gera slug automaticamente se não fornecido"""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Dish(models.Model):
    """
    Modelo de Prato do cardápio.
    Representa cada item disponível para pedido.
    """
    name = models.CharField(
        max_length=200,
        verbose_name='Nome'
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        verbose_name='Slug'
    )
    description = models.TextField(
        verbose_name='Descrição'
    )
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        verbose_name='Preço'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='dishes',
        verbose_name='Categoria'
    )
    image = models.ImageField(
        upload_to='dishes/',
        blank=True,
        null=True,
        verbose_name='Imagem'
    )
    video_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL do Vídeo'
    )
    available = models.BooleanField(
        default=True,
        verbose_name='Disponível'
    )
    vegetarian = models.BooleanField(
        default=False,
        verbose_name='Vegetariano'
    )
    stock = models.IntegerField(
        default=0,
        verbose_name='Estoque'
    )
    
    # Avaliações
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        verbose_name='Avaliação Média'
    )
    reviews_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Número de Avaliações'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )
    
    class Meta:
        verbose_name = 'Prato'
        verbose_name_plural = 'Pratos'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.category.name}"
    
    def save(self, *args, **kwargs):
        """Gera slug automaticamente se não fornecido"""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def is_available(self):
        """Verifica se o prato está disponível (considerando estoque)"""
        return self.available and self.stock > 0
    
    def update_rating(self):
        """Atualiza a média de avaliações do prato"""
        from django.db.models import Avg, Count
        
        stats = self.reviews.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating'),
            count=Count('id')
        )
        
        self.average_rating = stats['avg_rating'] or 0.00
        self.reviews_count = stats['count'] or 0
        self.save(update_fields=['average_rating', 'reviews_count'])



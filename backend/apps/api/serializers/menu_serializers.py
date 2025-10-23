"""
Serializers para cardápio (categorias e pratos).
João Macarrão - Sistema de Cardápio
"""
from rest_framework import serializers
from apps.core.models import Category, Dish


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer para Categoria do cardápio.
    """
    dishes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'dishes_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_dishes_count(self, obj):
        """Retorna quantidade de pratos na categoria"""
        return obj.dishes.count()


class DishSerializer(serializers.ModelSerializer):
    """
    Serializer para Prato do cardápio.
    Com categoria aninhada (read) e category_id (write).
    """
    category_data = CategorySerializer(source='category', read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Dish
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'category_id',
            'category_data',
            'image',
            'video_url',
            'available',
            'vegetarian',
            'stock',
            'is_available',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'is_available']
    
    def validate_price(self, value):
        """Validação: não permitir preço negativo"""
        if value < 0:
            raise serializers.ValidationError(
                "O preço não pode ser negativo."
            )
        return value
    
    def validate_stock(self, value):
        """Validação: não permitir estoque negativo"""
        if value < 0:
            raise serializers.ValidationError(
                "O estoque não pode ser negativo."
            )
        return value


class DishListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de pratos.
    Mais performático para listas grandes.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Dish
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'category_name',
            'image',
            'available',
            'vegetarian',
            'stock',
            'is_available'
        ]


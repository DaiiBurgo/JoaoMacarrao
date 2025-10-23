"""
Serializers para reviews.
João Macarrão - Sistema de Avaliações
"""
from rest_framework import serializers
from .models import DishReview, ReviewHelpful
from apps.core.models import Dish


class DishReviewSerializer(serializers.ModelSerializer):
    """
    Serializer para DishReview.
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.SerializerMethodField()
    dish_name = serializers.CharField(source='dish.name', read_only=True)
    is_editable = serializers.SerializerMethodField()
    
    class Meta:
        model = DishReview
        fields = [
            'id',
            'dish',
            'dish_name',
            'user',
            'user_name',
            'user_full_name',
            'rating',
            'comment',
            'is_approved',
            'helpful_count',
            'is_editable',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'user',
            'user_name',
            'user_full_name',
            'dish_name',
            'is_approved',
            'helpful_count',
            'created_at',
            'updated_at'
        ]
    
    def get_user_full_name(self, obj):
        """Retorna nome completo do usuário"""
        full_name = obj.user.get_full_name()
        return full_name if full_name else obj.user.username
    
    def get_is_editable(self, obj):
        """Verifica se o usuário pode editar esta avaliação"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.user == request.user or request.user.is_staff


class DishReviewCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de avaliação.
    """
    
    class Meta:
        model = DishReview
        fields = [
            'dish',
            'rating',
            'comment'
        ]
    
    def validate_rating(self, value):
        """Valida avaliação"""
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "A avaliação deve ser entre 1 e 5 estrelas."
            )
        return value
    
    def validate_dish(self, value):
        """Valida se o prato existe"""
        if not value.available:
            raise serializers.ValidationError(
                "Este prato não está mais disponível para avaliação."
            )
        return value
    
    def validate(self, attrs):
        """Valida se usuário já avaliou este prato"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            dish = attrs.get('dish')
            existing_review = DishReview.objects.filter(
                dish=dish,
                user=request.user
            ).first()
            
            if existing_review:
                raise serializers.ValidationError({
                    'dish': 'Você já avaliou este prato. Use a opção de editar.'
                })
        
        return attrs
    
    def create(self, validated_data):
        """Cria avaliação"""
        user = self.context.get('request').user
        validated_data['user'] = user
        return super().create(validated_data)


class DishReviewUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para atualização de avaliação.
    """
    
    class Meta:
        model = DishReview
        fields = [
            'rating',
            'comment'
        ]
    
    def validate_rating(self, value):
        """Valida avaliação"""
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "A avaliação deve ser entre 1 e 5 estrelas."
            )
        return value


class DishReviewListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de avaliações.
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DishReview
        fields = [
            'id',
            'user_name',
            'user_full_name',
            'rating',
            'comment',
            'helpful_count',
            'created_at'
        ]
    
    def get_user_full_name(self, obj):
        """Retorna nome completo do usuário"""
        full_name = obj.user.get_full_name()
        return full_name if full_name else obj.user.username


class DishWithReviewsSerializer(serializers.ModelSerializer):
    """
    Serializer de prato com suas avaliações.
    """
    reviews = DishReviewListSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Dish
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'category',
            'category_name',
            'image',
            'average_rating',
            'reviews_count',
            'available',
            'reviews'
        ]


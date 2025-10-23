from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import Category, Dish, Order, OrderItem

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin para o modelo de usuário customizado João Macarrão.
    Inclui gerenciamento de roles e campos de auditoria.
    """
    list_display = [
        'username', 
        'email', 
        'role', 
        'phone_number',
        'is_staff', 
        'needs_accessibility',
        'created_at'
    ]
    list_filter = [
        'is_staff', 
        'is_superuser', 
        'role',
        'needs_accessibility',
        'created_at'
    ]
    search_fields = ['username', 'email', 'phone_number']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Informações Pessoais', {
            'fields': ('first_name', 'last_name', 'email', 'phone_number')
        }),
        ('Permissões e Role', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Acessibilidade', {
            'fields': ('needs_accessibility', 'accessibility_notes'),
            'classes': ('collapse',)
        }),
        ('Datas Importantes', {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role')
        }),
        ('Informações Adicionais', {
            'classes': ('wide',),
            'fields': ('phone_number', 'needs_accessibility')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'date_joined', 'last_login']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin para o modelo de Categoria do cardápio.
    """
    list_display = ['name', 'slug', 'dishes_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def dishes_count(self, obj):
        """Retorna quantidade de pratos na categoria"""
        return obj.dishes.count()
    dishes_count.short_description = 'Qtd. Pratos'


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    """
    Admin para o modelo de Prato do cardápio.
    """
    list_display = [
        'name',
        'category',
        'price',
        'stock',
        'available',
        'vegetarian',
        'created_at'
    ]
    list_filter = [
        'category',
        'available',
        'vegetarian',
        'created_at'
    ]
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['category', 'name']
    readonly_fields = ['created_at', 'updated_at', 'is_available']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'slug', 'description', 'category')
        }),
        ('Preço e Estoque', {
            'fields': ('price', 'stock', 'available')
        }),
        ('Mídia', {
            'fields': ('image', 'video_url'),
            'classes': ('collapse',)
        }),
        ('Características', {
            'fields': ('vegetarian',)
        }),
        ('Status e Datas', {
            'fields': ('is_available', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_editable = ['available', 'stock']
    
    def is_available(self, obj):
        """Indica se o prato está disponível (com estoque)"""
        return obj.is_available
    is_available.boolean = True
    is_available.short_description = 'Disponível'


class OrderItemInline(admin.TabularInline):
    """
    Inline para itens do pedido.
    """
    model = OrderItem
    extra = 0
    readonly_fields = ['unit_price', 'subtotal']
    fields = ['dish', 'quantity', 'unit_price', 'subtotal', 'notes']
    
    def has_add_permission(self, request, obj=None):
        """Não permite adicionar itens após criação"""
        return obj is None
    
    def has_delete_permission(self, request, obj=None):
        """Não permite deletar itens"""
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Admin para o modelo de Pedido.
    """
    list_display = [
        'id',
        'user',
        'status',
        'payment_method',
        'total',
        'items_count',
        'created_at'
    ]
    list_filter = [
        'status',
        'payment_method',
        'created_at',
        'confirmed_at'
    ]
    search_fields = [
        'user__username',
        'user__email',
        'delivery_address'
    ]
    readonly_fields = [
        'subtotal',
        'total',
        'items_count',
        'created_at',
        'updated_at',
        'confirmed_at',
        'delivered_at'
    ]
    ordering = ['-created_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Cliente', {
            'fields': ('user',)
        }),
        ('Status e Pagamento', {
            'fields': ('status', 'payment_method')
        }),
        ('Entrega', {
            'fields': ('delivery_address', 'delivery_city', 'delivery_zip_code')
        }),
        ('Valores', {
            'fields': ('subtotal', 'delivery_fee', 'total')
        }),
        ('Observações', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Informações do Pedido', {
            'fields': ('items_count',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at', 'confirmed_at', 'delivered_at'),
            'classes': ('collapse',)
        }),
    )
    
    def items_count(self, obj):
        """Retorna quantidade total de itens"""
        return obj.items_count
    items_count.short_description = 'Qtd. Itens'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """
    Admin para o modelo de Item do Pedido.
    """
    list_display = [
        'order',
        'dish',
        'quantity',
        'unit_price',
        'subtotal'
    ]
    list_filter = ['order__status', 'dish__category']
    search_fields = ['order__id', 'dish__name']
    readonly_fields = ['subtotal']
    ordering = ['-order__created_at']


"""
Script para popular dados de teste da FASE 6
João Macarrão - Sistema de Contato, Reviews e Admin

Execute: python populate_fase6_data.py
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.core.models import User, Category, Dish
from apps.contact.models import ContactMessage
from apps.reviews.models import DishReview


def create_test_users():
    """Cria usuários de teste"""
    print("\n📝 Criando usuários de teste...")
    
    users_data = [
        ('cliente1', 'João Silva', 'joao@example.com'),
        ('cliente2', 'Maria Santos', 'maria@example.com'),
        ('cliente3', 'Pedro Oliveira', 'pedro@example.com'),
        ('cliente4', 'Ana Costa', 'ana@example.com'),
        ('cliente5', 'Julia Lima', 'julia@example.com'),
    ]
    
    created_users = []
    for username, full_name, email in users_data:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': full_name.split()[0],
                'last_name': ' '.join(full_name.split()[1:]),
                'role': 'cliente'
            }
        )
        if created:
            user.set_password('senha123')
            user.save()
            print(f"  ✅ {username} criado")
            created_users.append(user)
        else:
            print(f"  ℹ️  {username} já existe")
            created_users.append(user)
    
    return created_users


def create_test_dishes():
    """Cria pratos de teste"""
    print("\n🍝 Criando pratos de teste...")
    
    # Criar categorias
    massas, _ = Category.objects.get_or_create(
        name='Massas',
        defaults={'description': 'Deliciosas massas italianas caseiras'}
    )
    
    molhos, _ = Category.objects.get_or_create(
        name='Molhos',
        defaults={'description': 'Molhos especiais para acompanhar'}
    )
    
    bebidas, _ = Category.objects.get_or_create(
        name='Bebidas',
        defaults={'description': 'Bebidas refrescantes'}
    )
    
    # Criar pratos
    dishes_data = [
        {
            'name': 'Macarrão à Bolonhesa',
            'slug': 'macarrao-bolonhesa',
            'description': 'Macarrão al dente com molho bolonhesa caseiro, carne moída selecionada e temperos especiais',
            'price': 25.00,
            'category': massas,
            'available': True,
            'stock': 50
        },
        {
            'name': 'Lasanha Vegetariana',
            'slug': 'lasanha-vegetariana',
            'description': 'Camadas de massa fresca, legumes grelhados, molho branco e queijo gratinado',
            'price': 32.00,
            'category': massas,
            'available': True,
            'vegetarian': True,
            'stock': 30
        },
        {
            'name': 'Espaguete Carbonara',
            'slug': 'espaguete-carbonara',
            'description': 'Espaguete com bacon, ovos, queijo parmesão e pimenta do reino',
            'price': 28.00,
            'category': massas,
            'available': True,
            'stock': 40
        },
    ]
    
    created_dishes = []
    for dish_data in dishes_data:
        dish, created = Dish.objects.get_or_create(
            slug=dish_data['slug'],
            defaults=dish_data
        )
        if created:
            print(f"  ✅ {dish.name} criado")
        else:
            print(f"  ℹ️  {dish.name} já existe")
        created_dishes.append(dish)
    
    return created_dishes


def create_contact_messages(users):
    """Cria mensagens de contato de teste"""
    print("\n📞 Criando mensagens de contato...")
    
    messages_data = [
        {
            'name': 'Carlos Pereira',
            'email': 'carlos@example.com',
            'phone': '11987654321',
            'subject': 'Dúvida sobre delivery',
            'message': 'Olá! Gostaria de saber se vocês fazem entregas no bairro Jardins? Qual o valor da taxa?',
            'user': None
        },
        {
            'name': users[0].get_full_name(),
            'email': users[0].email,
            'phone': '11976543210',
            'subject': 'Elogio ao atendimento',
            'message': 'Quero parabenizar toda a equipe! O pedido chegou super rápido e a comida estava deliciosa!',
            'user': users[0]
        },
        {
            'name': 'Fernanda Souza',
            'email': 'fernanda@example.com',
            'subject': 'Sugestão de prato',
            'message': 'Adoraria se vocês incluíssem no cardápio opções de risotos. Tenho certeza que seria um sucesso!',
            'user': None
        },
        {
            'name': users[1].get_full_name(),
            'email': users[1].email,
            'phone': '11965432109',
            'subject': 'Problema com pedido',
            'message': 'Meu pedido #123 ainda não chegou. Já faz 1 hora. Podem verificar?',
            'user': users[1],
            'status': 'replied',
            'response': 'Olá! Pedimos desculpas pelo atraso. Seu pedido já saiu para entrega. Chegará em 15 minutos!',
        },
        {
            'name': 'Roberto Alves',
            'email': 'roberto@example.com',
            'phone': '11954321098',
            'subject': 'Informação nutricional',
            'message': 'Vocês disponibilizam informações nutricionais dos pratos? Tenho restrições alimentares.',
            'user': None
        },
    ]
    
    for msg_data in messages_data:
        msg, created = ContactMessage.objects.get_or_create(
            email=msg_data['email'],
            subject=msg_data['subject'],
            defaults=msg_data
        )
        if created:
            print(f"  ✅ Mensagem de {msg_data['name']}")
        else:
            print(f"  ℹ️  Mensagem de {msg_data['name']} já existe")


def create_reviews(users, dishes):
    """Cria avaliações de teste"""
    print("\n⭐ Criando avaliações de teste...")
    
    # Avaliações para Macarrão à Bolonhesa
    reviews_bolonhesa = [
        (users[0], 5, 'Simplesmente perfeito! O molho é caseiro e o macarrão vem no ponto ideal. Melhor macarrão que já comi! 🍝'),
        (users[1], 5, 'Excelente! A porção é bem servida e o sabor é incrível. Virou meu prato favorito!'),
        (users[2], 4, 'Muito bom! Só achei um pouco salgado para o meu gosto, mas ainda assim delicioso.'),
        (users[3], 5, 'Maravilhoso! A carne moída é de primeira qualidade. Recomendo demais!'),
        (users[4], 4, 'Ótimo prato! Chegou quentinho e bem embalado. Voltarei a pedir com certeza.'),
    ]
    
    for user, rating, comment in reviews_bolonhesa:
        review, created = DishReview.objects.get_or_create(
            dish=dishes[0],
            user=user,
            defaults={
                'rating': rating,
                'comment': comment,
                'is_approved': True
            }
        )
        if created:
            print(f"  ✅ {user.username}: {rating}⭐ - {dishes[0].name}")
        else:
            print(f"  ℹ️  Avaliação de {user.username} já existe")
    
    # Avaliações para Lasanha Vegetariana
    reviews_lasanha = [
        (users[0], 5, 'Perfeita para vegetarianos! Os legumes estão fresquinhos e o queijo gratinado é divino.'),
        (users[1], 4, 'Muito saborosa! Achei a porção um pouco pequena, mas a qualidade é excelente.'),
        (users[2], 5, 'Melhor lasanha vegetariana que já comi! Super recomendo!'),
    ]
    
    for user, rating, comment in reviews_lasanha:
        review, created = DishReview.objects.get_or_create(
            dish=dishes[1],
            user=user,
            defaults={
                'rating': rating,
                'comment': comment,
                'is_approved': True
            }
        )
        if created:
            print(f"  ✅ {user.username}: {rating}⭐ - {dishes[1].name}")
    
    # Avaliações para Carbonara
    reviews_carbonara = [
        (users[3], 5, 'Autêntica carbonara! O bacon é crocante e o molho cremoso na medida certa.'),
        (users[4], 4, 'Muito gostoso! Só esperava mais bacon, mas o sabor é ótimo.'),
    ]
    
    for user, rating, comment in reviews_carbonara:
        review, created = DishReview.objects.get_or_create(
            dish=dishes[2],
            user=user,
            defaults={
                'rating': rating,
                'comment': comment,
                'is_approved': True
            }
        )
        if created:
            print(f"  ✅ {user.username}: {rating}⭐ - {dishes[2].name}")


def update_dish_ratings(dishes):
    """Atualiza as médias dos pratos"""
    print("\n📊 Atualizando médias de avaliações...")
    
    for dish in dishes:
        dish.update_rating()
        print(f"  ✅ {dish.name}: ⭐ {dish.average_rating} ({dish.reviews_count} avaliações)")


def print_summary():
    """Imprime resumo dos dados criados"""
    print("\n" + "="*60)
    print("📊 RESUMO DOS DADOS CRIADOS")
    print("="*60)
    
    print(f"\n👥 Usuários: {User.objects.count()}")
    print(f"🍝 Pratos: {Dish.objects.count()}")
    print(f"📞 Mensagens de Contato: {ContactMessage.objects.count()}")
    print(f"⭐ Avaliações: {DishReview.objects.count()}")
    
    print("\n📈 ESTATÍSTICAS DE AVALIAÇÕES:")
    for dish in Dish.objects.filter(reviews_count__gt=0):
        print(f"  {dish.name}:")
        print(f"    ⭐ Média: {dish.average_rating}")
        print(f"    📝 Total: {dish.reviews_count} avaliações")
    
    print("\n📬 MENSAGENS DE CONTATO:")
    pending = ContactMessage.objects.filter(status='pending').count()
    replied = ContactMessage.objects.filter(status='replied').count()
    print(f"  ⏳ Pendentes: {pending}")
    print(f"  ✅ Respondidas: {replied}")
    
    print("\n" + "="*60)
    print("✅ DADOS POPULADOS COM SUCESSO!")
    print("="*60)
    
    print("\n🚀 PRÓXIMOS PASSOS:")
    print("  1. Acesse o admin: http://localhost:8000/admin")
    print("  2. Teste os endpoints da API")
    print("  3. Verifique as estatísticas")
    print("\n📚 Consulte TESTE_FASE_6.md para mais detalhes!")


def main():
    """Função principal"""
    print("="*60)
    print("🍝 JOÃO MACARRÃO - POPULAR DADOS DA FASE 6")
    print("="*60)
    
    try:
        users = create_test_users()
        dishes = create_test_dishes()
        create_contact_messages(users)
        create_reviews(users, dishes)
        update_dish_ratings(dishes)
        print_summary()
        
    except Exception as e:
        print(f"\n❌ ERRO: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())


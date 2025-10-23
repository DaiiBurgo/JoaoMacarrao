"""
Script para limpar cache e testar configuração
"""
import os
import shutil
from pathlib import Path

def clean_pycache():
    """Remove todos os __pycache__"""
    backend_dir = Path(__file__).parent
    print("🧹 Limpando cache Python...")
    
    count = 0
    for pycache in backend_dir.rglob('__pycache__'):
        if pycache.is_dir():
            shutil.rmtree(pycache)
            count += 1
            print(f"  ✅ Removido: {pycache.relative_to(backend_dir)}")
    
    print(f"\n✅ {count} diretórios __pycache__ removidos")

def test_imports():
    """Testa imports dos apps"""
    print("\n🧪 Testando imports dos apps...")
    
    apps_to_test = [
        'apps.core',
        'apps.api',
        'apps.payments',
        'apps.accessibility',
        'apps.contact',
        'apps.reviews',
    ]
    
    for app_name in apps_to_test:
        try:
            __import__(app_name)
            print(f"  ✅ {app_name}")
        except Exception as e:
            print(f"  ❌ {app_name}: {str(e)}")
            return False
    
    return True

def main():
    print("="*60)
    print("🍝 JOÃO MACARRÃO - FIX E TESTE")
    print("="*60)
    
    # Limpar cache
    clean_pycache()
    
    # Testar imports
    if test_imports():
        print("\n✅ Todos os apps estão configurados corretamente!")
        print("\n🚀 Próximos passos:")
        print("  1. python manage.py makemigrations contact reviews core")
        print("  2. python manage.py migrate")
        print("  3. python manage.py runserver")
    else:
        print("\n❌ Ainda há problemas com os imports")
        return 1
    
    print("\n" + "="*60)
    return 0

if __name__ == '__main__':
    exit(main())


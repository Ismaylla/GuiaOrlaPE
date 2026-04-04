import Image from "next/image";

export default function SplashScreen() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start pt-10 md:pt-20 overflow-hidden px-4">
      
      {/* Conteúdo Agrupado */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        
        {/* Logotipo: Ajuste de tamanho responsivo */}
        <div className="relative h-56 w-56 md:h-80 md:w-80 transition-all">
          <Image
            src="/images/LOGOfundotransparente 3.png"
            alt="GuiaOrlaPE Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Bloco de Texto e Botões */}
        <div className="flex flex-col items-center gap-8 w-full">
          
          {/* Frase */}
          <p className="text-center font-medium text-azul-primario mt-[-10px] md:mt-[-20px] px-6" style={{ fontSize: '16px' }}>
            Descubra o melhor da orla, pertinho de você!
          </p>

          {/* Container de Botões: EMPILHA no mobile (col), LADO A LADO no desktop (row) */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-[30px] items-center justify-center mt-6 w-full">
            
            {/* Botão Sou Turista */}
            <button className="flex items-center justify-center h-[50px] w-full max-w-[280px] rounded-[50px] font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95" 
                    style={{ 
                      background: 'linear-gradient(180deg, #1398D4 0%, #0A4F6E 80%)'
                    }}>
              Sou Turista
            </button>
            
            {/* Botão Sou Empreendedor */}
            <button className="flex items-center justify-center h-[50px] w-full max-w-[280px] rounded-[50px] font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                    style={{ 
                      background: 'linear-gradient(180deg, #FF904B 0%, #D66017 80%)'
                    }}>
              Sou Empreendedor
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
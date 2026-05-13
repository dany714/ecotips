export const initialTips = [
    {
        id: '1',
        title: 'Reduce tu consumo de agua',
        description: 'Cierra la llave mientras te cepillas los dientes o te lavas las manos. Puedes ahorrar hasta 15 litros por minuto.',
        category: 'Naturaleza',
        color: 'var(--postit-1)',
        authorName: 'Anónimo',
        authorId: null,
        likes: 120,
        reportsCount: 0,
        isSuspended: false,
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Usa bolsas reutilizables',
        description: 'Lleva siempre contigo una bolsa de tela cuando vayas de compras para evitar el uso de bolsas plásticas.',
        category: 'Residuos',
        color: 'var(--postit-2)',
        authorName: 'María G.',
        authorId: 'user-maria',
        likes: 85,
        reportsCount: 0,
        isSuspended: false,
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Apaga las luces',
        description: 'Aprovecha la luz natural en el día y apaga las luces que no estés usando.',
        category: 'Energía',
        color: 'var(--postit-3)',
        authorName: 'Carlos T.',
        authorId: 'user-carlos',
        likes: 240,
        reportsCount: 0,
        isSuspended: false,
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        title: 'Separa tu basura',
        description: 'Divide los residuos en orgánicos e inorgánicos para facilitar su reciclaje.',
        category: 'Reciclaje',
        color: 'var(--postit-4)',
        authorName: 'Anónimo',
        authorId: null,
        likes: 45,
        reportsCount: 0,
        isSuspended: false,
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        title: 'Camina o usa bicicleta',
        description: 'Si recorres distancias cortas, evita usar el auto. Mejorarás tu salud y el medio ambiente.',
        category: 'Energía',
        color: 'var(--postit-5)',
        authorName: 'Ana Ruiz',
        authorId: 'user-ana',
        likes: 310,
        reportsCount: 0,
        isSuspended: false,
        createdAt: new Date().toISOString()
    }
];

export const initialComments = [
    {
        id: 'c1',
        tipId: '1',
        authorName: 'Benito Migajas',
        text: 'Muy útil, gracias por compartir',
        createdAt: new Date().toISOString()
    }
];

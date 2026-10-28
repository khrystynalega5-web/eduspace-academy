
const courseNames = [
    "Основи HTML та CSS",
    "JavaScript для початківців",
    "React з нуля",
    "Сучасний Frontend",
    "Адаптивна веброзробка",
    "Python для початківців",
    "Основи програмування",
    "Backend на Python",
    "REST API",
    "Алгоритми та структури даних",
    "Основи UI/UX дизайну",
    "Figma для початківців",
    "Вебдизайн",
    "Дизайн мобільних застосунків",
    "Прототипування інтерфейсів",
    "Основи Data Science",
    "Аналіз даних із Python",
    "SQL для аналітиків",
    "Візуалізація даних",
    "Машинне навчання",
    "Основи DevOps",
    "Хмарні технології",
    "Docker для розробників",
    "Основи Linux",
    "Розгортання вебзастосунків"
];

export const initialCourses = courseNames.map((title, index) => {
    const id = index + 1;

    return {
        id,
        title,
        description: `Практичний навчальний курс: ${title}.`,
        shortDescription: `Опануйте ${title.toLowerCase()} з практичними завданнями.`,
        price: 500 + index * 100,
        duration: 10 + (index % 8) * 5,
        startDate: `2027-${String((index % 12) + 1).padStart(2, "0")}-15`,
        level: ["Початковий", "Середній", "Просунутий"][index % 3],
        format: ["Онлайн", "Офлайн", "Змішаний"][index % 3],
        isPopular: index % 3 === 0,
        isActive: true,
        instructorId: (index % 5) + 1,
        skillIds: [
            (index % 8) + 1,
            ((index + 1) % 8) + 1
        ],
        image: ""
    };
});

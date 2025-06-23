
//перенос на секцию сайта с регистрацией при нажатии кнопки

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}



// анимация надписей в 4 блоке при скролле

document.addEventListener("DOMContentLoaded", function() {
    const phrases = document.querySelectorAll(".phrase1, .phrase2, .phrase3, .phrase6");
    
    // создаем наблюдатель Intersection Observer
    const observerOptions = {
        rootMargin: '0px',
        threshold: 0.2   // показывать анимацию, когда видимость >= 20%
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('phrases_animation');
                observer.unobserve(entry.target); // остановка наблюдения после однократного показа
            }
        });
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    phrases.forEach(p => {
        observer.observe(p);
    });
});

// временное изменение цвета кнопки после нажатия

function changeColor(identifier) {
  const originalColor = identifier.style.background; // Сохраняем исходный цвет
  identifier.style.background = "linear-gradient(white, #78b3af)";
  setTimeout(() => {
    identifier.style.background = originalColor;
  }, 1000); 
}




// Функция debounce для отсрочки проверки
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Общая функция для валидации полей

function validateField(input, rules) {
    let isValid = true;
    let errorMessage = '';

    // Проходим по списку правил
    for (let rule of rules) {
        switch(rule.type) {
            case 'required':
                if (input.value.trim().length === 0) {
                    isValid = false;
                    errorMessage = `${rule.message}`;
                }
                break;
            case 'minLength':
                if (input.value.length < rule.length) {
                    isValid = false;
                    errorMessage = `${rule.message}`;
                }
                break;
            case 'email':
                if (!isValidEmail(input.value)) {
                    isValid = false;
                    errorMessage = `${rule.message}`;
                }
                break;
            case 'customRegex':
                if (!rule.regex.test(input.value)) {
                    isValid = false;
                    errorMessage = `${rule.message}`;
                }
                break;
            case 'ageCheck': 
                const birthDate = new Date(input.value);
                const today = new Date();
                const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000)); // Рассчитываем возраст
                if (age < 14) { // Ограничение 14+ для регистрации
                    errorMessage = `${rule.message}`;
                }
                break;
            default:
                throw new Error(`Unknown validation rule type: ${rule.type}`);
        }
    }

    return { isValid, errorMessage };
}

// Проверка корректности email
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// Функция индивидуальной проверки полей при вводе и потере фокуса
// Устанавливает класс valid-field при прохождении проверки
function checkField(inputId, rules) {
    const input = document.getElementById(inputId);
    const result = validateField(input, rules);

    if (!result.isValid) {
        input.classList.remove('valid-field'); // Убираем выделение цветом, если есть ошибка
    } else {
        input.classList.add('valid-field'); // Выделяем зеленым цветом 
    }
}

// Привязываем обработчики событий для полей формы вопросов
// Debounce уменьшает частоту проверки, улучшая производительность
document.getElementById('t1').addEventListener('blur', debounce(() =>
    checkField('t1', validationRulesFeedback.t1), 300));
document.getElementById('t1').addEventListener('input', debounce(() =>
    checkField('t1', validationRulesFeedback.t1), 300));

document.getElementById('t2').addEventListener('blur', debounce(() =>
    checkField('t2', validationRulesFeedback.t2), 300));
document.getElementById('t2').addEventListener('input', debounce(() =>
    checkField('t2', validationRulesFeedback.t2), 300));

document.getElementById('t3').addEventListener('blur', debounce(() =>
    checkField('t3', validationRulesFeedback.t3), 300));
document.getElementById('t3').addEventListener('input', debounce(() =>
    checkField('t3', validationRulesFeedback.t3), 300));

// Добавляем обработчики для формы регистрации
document.getElementById('field1').addEventListener('blur', debounce(() =>
    checkField('field1', validationRulesRegistration.field1), 300));
document.getElementById('field1').addEventListener('input', debounce(() =>
    checkField('field1', validationRulesRegistration.field1), 300));

document.getElementById('field2').addEventListener('blur', debounce(() =>
    checkField('field2', validationRulesRegistration.field2), 300));
document.getElementById('field2').addEventListener('input', debounce(() =>
    checkField('field2', validationRulesRegistration.field2), 300));

document.getElementById('field3').addEventListener('blur', debounce(() =>
    checkField('field3', validationRulesRegistration.field3), 300));
document.getElementById('field3').addEventListener('input', debounce(() =>
    checkField('field3', validationRulesRegistration.field3), 300));

document.getElementById('field4').addEventListener('blur', debounce(() =>
    checkField('field4', validationRulesRegistration.field4), 300));
document.getElementById('field4').addEventListener('input', debounce(() =>
    checkField('field4', validationRulesRegistration.field4), 300));

document.getElementById('field5').addEventListener('blur', debounce(() =>
    checkField('field5', validationRulesRegistration.field5), 300));
document.getElementById('field5').addEventListener('input', debounce(() =>
    checkField('field5', validationRulesRegistration.field5), 300));

// Основной обработчик отправки формы
// Проверяет все поля формы и показывает общую информацию о данных
function handleSubmit(e, rules, form) {
    let isValid = true;

    // Полностью проверяем все поля формы только при отправке
    Object.keys(rules).every(key => {
        const input = form.querySelector(`#${key}`);
        const result = validateField(input, rules[key]);

        if (!result.isValid) {
            isValid = false;
            alert(result.errorMessage); // Показываем сообщение об ошибке
            return false; // Останавливаем проверку остальных полей
        } else {
            input.classList.add('valid-field'); // Выделяем зеленым цветом
        }

        return true; // Переходим к следующей итерации
    });

    if (!isValid) {
        e.preventDefault(); // Предотвращаем отправку формы
    } else {
        // Собираем данные из формы в зависимости от типа формы
        const data = {};
        Object.keys(rules).forEach(key => {
            data[key] = form.querySelector(`#${key}`).value;
        });

        let successMessage;
        if (form.classList.contains('questions_form')) {
            successMessage = `
                Ваши данные:\n
                Имя: ${data.t1}
                Email: ${data.t2}
                Вопрос: ${data.t3}`;
        } else if (form.classList.contains('registr_form')) {
            successMessage = `
                Ваши данные:\n
                Имя: ${data.field1}
                Телефон: ${data.field2}
                Email: ${data.field3}
                Дата рождения: ${data.field4}
                Пароль: ********`;
        }

        // Алерты показывают собранные данные, после чего поля очищаются
        alert(successMessage);
        form.reset(); // Сброс формы
        document.querySelectorAll('.valid-field').forEach(field => {
            field.classList.remove('valid-field'); // Убираем зеленый цвет
        });
        e.preventDefault(); // Предотвращаем отправку формы
    }

    return isValid;
}

// Правила валидации для формы вопросов
const validationRulesFeedback = {
    t1: [
        { type: 'required', message: 'Введите имя.' },
        { type: 'customRegex', regex: /^[A-Za-zА-Яа-яЁё\s]{3,}$/, message: 'Имя должно быть осмысленным словом.' }
    ],
    t2: [
        { type: 'required', message: 'Введите Email.' },
        { type: 'email', message: 'Адрес электронной почты введен неверно.' }
    ],
    t3: [
        { type: 'required', message: 'Введите вопрос.' },
        { type: 'customRegex', regex: /^[A-Za-zА-Яа-яЁё0-9\s.,!?:;"'-]*$/, message: 'Вопрос должен быть осмысленным текстом.' }
    ]
};

// Правила валидации для формы регистрации
const validationRulesRegistration = {
    field1: [
        { type: 'required', message: 'Введите имя.' },
        { type: 'customRegex', regex: /^[A-Za-zА-Яа-яЁё\s]{3,}$/, message: 'Имя должно быть осмысленным словом.' }
    ],
    field2: [
        { type: 'required', message: 'Введите номер телефона.' },
        { type: 'customRegex', regex: /^([+]?[0-9\s-$$]{10,})*$/i, message: 'Телефон введен неверно.' } 
    ],
    field3: [
        { type: 'required', message: 'Введите Email.' },
        { type: 'email', message: 'Адрес электронной почты введен неверно.' }
    ],
    field4: [
        { type: 'required', message: 'Введите дату рождения.' },
        { type: 'ageCheck', message: 'Вам должно быть больше 14 лет.' }
    ],
    field5: [
        { type: 'required', message: 'Придумайте пароль.' },
        { type: 'customRegex', regex: /^.{8,}$/, message: 'Пароль должен содержать не менее 8 символов.' }
    ]
};
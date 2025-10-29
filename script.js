// Инициализация данных при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadData();
    
    // Обработчики форм
    const machineForm = document.getElementById('machine-form');
    if (machineForm) {
        machineForm.addEventListener('submit', handleMachineSubmit);
    }
    
    const repairTypeForm = document.getElementById('repair-type-form');
    if (repairTypeForm) {
        repairTypeForm.addEventListener('submit', handleRepairTypeSubmit);
    }
    
    const repairWorkForm = document.getElementById('repair-work-form');
    if (repairWorkForm) {
        repairWorkForm.addEventListener('submit', handleRepairWorkSubmit);
    }
    
    // Установка текущей даты по умолчанию
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        startDateInput.valueAsDate = new Date();
    }
});

// Инициализация данных в localStorage
function initializeData() {
    if (!localStorage.getItem('machines')) {
        const sampleMachines = [
            { machine_code: 'M001', country: 'Германия', year: 2018, brand: 'Siemens' },
            { machine_code: 'M002', country: 'Япония', year: 2020, brand: 'Mazak' },
            { machine_code: 'M003', country: 'Россия', year: 2015, brand: 'Станкосиб' }
        ];
        localStorage.setItem('machines', JSON.stringify(sampleMachines));
    }
    
    if (!localStorage.getItem('repair_types')) {
        const sampleRepairs = [
            { repair_code: 'R001', repair_name: 'Текущий ремонт', duration: 3, cost: 15000, notes: 'Замена изношенных деталей' },
            { repair_code: 'R002', repair_name: 'Капитальный ремонт', duration: 10, cost: 50000, notes: 'Полная разборка и замена основных узлов' },
            { repair_code: 'R003', repair_name: 'Техническое обслуживание', duration: 1, cost: 5000, notes: 'Регулярное ТО' }
        ];
        localStorage.setItem('repair_types', JSON.stringify(sampleRepairs));
    }
    
    if (!localStorage.getItem('repair_works')) {
        const sampleWorks = [
            { machine_code: 'M001', repair_code: 'R001', start_date: '2024-01-15', notes: 'Ремонт выполнен в срок' },
            { machine_code: 'M002', repair_code: 'R003', start_date: '2024-02-01', notes: 'Плановое ТО' }
        ];
        localStorage.setItem('repair_works', JSON.stringify(sampleWorks));
    }
}

// Загрузка данных на страницы
function loadData() {
    loadMainPageStats();
    loadMachinesTable();
    loadRepairTypesTable();
    loadRepairWorksTable();
    populateSelects();
}

// Статистика на главной странице
function loadMainPageStats() {
    const machinesCount = document.getElementById('machines-count');
    const repairsCount = document.getElementById('repairs-count');
    const worksCount = document.getElementById('works-count');
    
    if (machinesCount) {
        const machines = JSON.parse(localStorage.getItem('machines') || '[]');
        machinesCount.textContent = machines.length;
    }
    
    if (repairsCount) {
        const repairTypes = JSON.parse(localStorage.getItem('repair_types') || '[]');
        repairsCount.textContent = repairTypes.length;
    }
    
    if (worksCount) {
        const repairWorks = JSON.parse(localStorage.getItem('repair_works') || '[]');
        worksCount.textContent = repairWorks.length;
    }
}

// Загрузка таблицы станков
function loadMachinesTable() {
    const tbody = document.getElementById('machines-tbody');
    if (!tbody) return;
    
    const machines = JSON.parse(localStorage.getItem('machines') || '[]');
    tbody.innerHTML = '';
    
    machines.forEach(machine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${machine.machine_code}</td>
            <td>${machine.country}</td>
            <td>${machine.year}</td>
            <td>${machine.brand}</td>
            <td>
                <button onclick="deleteMachine('${machine.machine_code}')" class="delete-btn">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Загрузка таблицы видов ремонта
function loadRepairTypesTable() {
    const tbody = document.getElementById('repair-types-tbody');
    if (!tbody) return;
    
    const repairTypes = JSON.parse(localStorage.getItem('repair_types') || '[]');
    tbody.innerHTML = '';
    
    repairTypes.forEach(repair => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${repair.repair_code}</td>
            <td>${repair.repair_name}</td>
            <td>${repair.duration} дней</td>
            <td>${parseFloat(repair.cost).toLocaleString('ru-RU')} руб.</td>
            <td>${repair.notes || '-'}</td>
            <td>
                <button onclick="deleteRepairType('${repair.repair_code}')" class="delete-btn">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Загрузка таблицы проведенных ремонтов
function loadRepairWorksTable() {
    const tbody = document.getElementById('repair-works-tbody');
    if (!tbody) return;
    
    const repairWorks = JSON.parse(localStorage.getItem('repair_works') || '[]');
    tbody.innerHTML = '';
    
    repairWorks.forEach(work => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${work.machine_code}</td>
            <td>${work.repair_code}</td>
            <td>${work.start_date}</td>
            <td>${work.notes || '-'}</td>
            <td>
                <button onclick="deleteRepairWork('${work.machine_code}', '${work.repair_code}', '${work.start_date}')" class="delete-btn">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Заполнение выпадающих списков
function populateSelects() {
    const machineSelect = document.getElementById('machine-select');
    const repairSelect = document.getElementById('repair-select');
    
    if (machineSelect) {
        const machines = JSON.parse(localStorage.getItem('machines') || '[]');
        machineSelect.innerHTML = '<option value="">Выберите станок</option>';
        machines.forEach(machine => {
            const option = document.createElement('option');
            option.value = machine.machine_code;
            option.textContent = `${machine.machine_code} - ${machine.brand} (${machine.country})`;
            machineSelect.appendChild(option);
        });
    }
    
    if (repairSelect) {
        const repairTypes = JSON.parse(localStorage.getItem('repair_types') || '[]');
        repairSelect.innerHTML = '<option value="">Выберите вид ремонта</option>';
        repairTypes.forEach(repair => {
            const option = document.createElement('option');
            option.value = repair.repair_code;
            option.textContent = `${repair.repair_code} - ${repair.repair_name} (${repair.cost} руб.)`;
            repairSelect.appendChild(option);
        });
    }
}

// Обработчики форм
function handleMachineSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const machine = {
        machine_code: formData.get('machine_code'),
        country: formData.get('country'),
        year: parseInt(formData.get('year')),
        brand: formData.get('brand')
    };
    
    const machines = JSON.parse(localStorage.getItem('machines') || '[]');
    machines.push(machine);
    localStorage.setItem('machines', JSON.stringify(machines));
    
    e.target.reset();
    loadData();
    alert('Станок успешно добавлен!');
}

function handleRepairTypeSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const repairType = {
        repair_code: formData.get('repair_code'),
        repair_name: formData.get('repair_name'),
        duration: parseInt(formData.get('duration')),
        cost: parseFloat(formData.get('cost')),
        notes: formData.get('notes')
    };
    
    const repairTypes = JSON.parse(localStorage.getItem('repair_types') || '[]');
    repairTypes.push(repairType);
    localStorage.setItem('repair_types', JSON.stringify(repairTypes));
    
    e.target.reset();
    loadData();
    alert('Вид ремонта успешно добавлен!');
}

function handleRepairWorkSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const repairWork = {
        machine_code: formData.get('machine_code'),
        repair_code: formData.get('repair_code'),
        start_date: formData.get('start_date'),
        notes: formData.get('notes')
    };
    
    const repairWorks = JSON.parse(localStorage.getItem('repair_works') || '[]');
    repairWorks.push(repairWork);
    localStorage.setItem('repair_works', JSON.stringify(repairWorks));
    
    e.target.reset();
    document.getElementById('start-date').valueAsDate = new Date();
    loadData();
    alert('Ремонт успешно зарегистрирован!');
}

// Функции удаления
function deleteMachine(machineCode) {
    if (confirm('Вы уверены, что хотите удалить этот станок?')) {
        const machines = JSON.parse(localStorage.getItem('machines') || '[]');
        const filteredMachines = machines.filter(m => m.machine_code !== machineCode);
        localStorage.setItem('machines', JSON.stringify(filteredMachines));
        loadData();
    }
}

function deleteRepairType(repairCode) {
    if (confirm('Вы уверены, что хотите удалить этот вид ремонта?')) {
        const repairTypes = JSON.parse(localStorage.getItem('repair_types') || '[]');
        const filteredRepairTypes = repairTypes.filter(r => r.repair_code !== repairCode);
        localStorage.setItem('repair_types', JSON.stringify(filteredRepairTypes));
        loadData();
    }
}

function deleteRepairWork(machineCode, repairCode, startDate) {
    if (confirm('Вы уверены, что хотите удалить эту запись о ремонте?')) {
        const repairWorks = JSON.parse(localStorage.getItem('repair_works') || '[]');
        const filteredRepairWorks = repairWorks.filter(w => 
            w.machine_code !== machineCode || 
            w.repair_code !== repairCode || 
            w.start_date !== startDate
        );
        localStorage.setItem('repair_works', JSON.stringify(filteredRepairWorks));
        loadData();
    }
}

// Управление вкладками
function openTab(tabName) {
    // Скрыть все вкладки
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Убрать активный класс со всех кнопок
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Показать выбранную вкладку
    document.getElementById(tabName).classList.add('active');
    
    // Сделать кнопку активной
    event.currentTarget.classList.add('active');
}
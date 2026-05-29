// Constantes
const SCREENS = {
  HOME: "home",
  REPORT: "report",
  COLLABORATOR_SIGNUP: "collaborator_signup"
};

const REPORT_STATUS = {
  PENDING: "pending",
  IN_REVIEW: "in_review",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved"
};

const HOME_TABS = {
  MAIN: "pagina-inicial",
  DEVELOPERS: "desenvolvedores",
  DONATIONS: "doacoes",
  ABOUT: "sobre",
  COLLABORATORS: "colaboradores"
};

// Estado da aplicação
const state = {
  screen: SCREENS.HOME,
  user: null,
  reports: [],
  collaborators: [],
  locationData: null,
  photo: null,
  email: "",
  password: "",
  newReport: { title: "", description: "", category: "", subcategory: "", value: 0 },
  collaboratorSignup: { name: "", email: "", password: "", company: "", cnpj: "", services: "" },
  map: null,
  homeTab: HOME_TABS.MAIN,
  categoryFilter: 'all',
  statusFilter: 'all',
  notifications: {
    enabled: false,
    permission: 'default',
    history: []
  }
};

// INIT
function init() {
  const savedUser = localStorage.getItem("user");
  if (savedUser) state.user = JSON.parse(savedUser);

  const savedReports = localStorage.getItem("reports");
  if (savedReports) state.reports = JSON.parse(savedReports);

  const savedCollaborators = localStorage.getItem("collaborators");
  if (savedCollaborators) state.collaborators = JSON.parse(savedCollaborators);

  initNotifications();
  render();
}

function saveCollaborators() {
  localStorage.setItem("collaborators", JSON.stringify(state.collaborators));
}

function saveReports() {
  localStorage.setItem("reports", JSON.stringify(state.reports));
}

function setHomeTab(tab) {
  state.homeTab = tab;
  render();
}

function setCategoryFilter(filter) {
  state.categoryFilter = filter;
  render();
}

function setStatusFilter(filter) {
  state.statusFilter = filter;
  render();
}

function renderHomeTabContent() {
  const totalReports = state.reports.length;
  const reportsWithLocation = state.reports.filter(r => r.location).length;

  const filteredReports = state.reports.filter(r =>
    (state.categoryFilter === 'all' || r.category === state.categoryFilter) &&
    (state.statusFilter === 'all' || r.status === state.statusFilter)
  );

  if (state.homeTab === HOME_TABS.DEVELOPERS) {
    return `
      <div class="section-card">
        <h2>Desenvolvedores</h2>
        <p>Este aplicativo foi desenvolvido para facilitar o envio de denúncias e melhorar a comunicação com a comunidade.</p>
        <p><strong>Equipe:</strong></p>
        <div class="developers-grid">
          <div class="developer-card">
            <img src="D:\Cidade Alerta\Imagens\jhonata.jpg" alt="Jhonata Espinoza" class="developer-photo">
            <h3>Jhonata Espinoza</h3>
            
            <p>Desenvolvedor Principal</p>
          </div>
          <div class="developer-card">
            <div class="developer-placeholder">👨‍💻</div>
            <h3>Desenvolvedor 2</h3>
            <p>Contribuidor</p>
          </div>
          <div class="developer-card">
            <div class="developer-placeholder">👨‍💻</div>
            <h3>Desenvolvedor 3</h3>
            <p>Contribuidor</p>
          </div>
        </div>
      </div>
    `;
  }

  if (state.homeTab === HOME_TABS.DONATIONS) {
    return `
      <div class="section-card">
        <h2>Doações</h2>
        <p>Se quiser apoiar o projeto, suas doações ajudam a manter o serviço ativo e a melhorar novas funcionalidades.</p>
        
        <div class="donation-methods">
          <button class="btn-pix" onclick="window.open('https://nubank.com.br/pix/chavepix@cidadealerta.com', '_blank')">
            <div class="pix-icon">🎯</div>
            <div class="pix-text">
              <strong>Pagar com PIX</strong>
              <small>Transferência imediata</small>
            </div>
          </button>
          
          <button class="btn-picpay" onclick="window.open('https://picpay.com/cidadealerta', '_blank')">
            <div class="picpay-icon">💳</div>
            <div class="picpay-text">
              <strong>PicPay</strong>
              <small>Doação via PicPay</small>
            </div>
          </button>
        </div>
        
        <p style="margin-top: 20px; color: #aaa; font-size: 0.9em;">Dúvidas? Envie um email para <strong>suporte@cidadealerta.com</strong></p>
      </div>
    `;
  }

  if (state.homeTab === HOME_TABS.ABOUT) {
    return `
      <div class="section-card">
        <h2>Sobre</h2>
        <p>Cidade Alerta é uma ferramenta de denúncia comunitária criada para ajudar a população a reportar problemas locais de forma rápida e segura.</p>
        <p>Versão 1.0. Suporte e melhorias constantes para a comunidade.</p>
      </div>
    `;
  }

  if (state.homeTab === HOME_TABS.COLLABORATORS) {
    const defaultCollaborators = [
      { avatar: '🏗️', name: 'Construtora Silva Ltda', cnpj: '12.345.678/0001-90', services: 'Infraestrutura urbana, reparos em vias públicas', badge: 'Infraestrutura' },
      { avatar: '🧹', name: 'Limpeza Urbana S.A.', cnpj: '98.765.432/0001-10', services: 'Coleta de lixo, limpeza de praças e ruas', badge: 'Limpeza' },
      { avatar: '💡', name: 'Iluminação Municipal Ltda', cnpj: '11.222.333/0001-44', services: 'Manutenção de iluminação pública', badge: 'Iluminação' },
      { avatar: '🚧', name: 'Pavimentação Express', cnpj: '55.666.777/0001-88', services: 'Reparos em pavimentação e sinalização', badge: 'Pavimentação' }
    ];
    const allCollaborators = [...defaultCollaborators, ...state.collaborators.map(c => ({ avatar: '🏢', name: c.company, cnpj: c.cnpj, services: c.services, badge: 'Parceiro' }))];
    return `
      <div class="section-card">
        <h2>Empresas Parceiras</h2>
        <p>Empresas credenciadas que utilizam as denúncias da plataforma para prestar serviços à comunidade.</p>
        <p><strong>Parceiros Ativos:</strong></p>
        <div class="collaborators-grid">
          ${allCollaborators.map(c => `
            <div class="collaborator-card">
              <div class="collaborator-avatar">${c.avatar}</div>
              <h4>${c.name}</h4>
              <p>CNPJ: ${c.cnpj}</p>
              <p>Serviços: ${c.services}</p>
              <span class="collaborator-badge">${c.badge}</span>
            </div>
          `).join('')}
        </div>
        <p style="margin-top: 20px; color: #aaa; font-size: 0.9em;">Quer se tornar um parceiro? <button class="btn-small" onclick="state.screen='${SCREENS.COLLABORATOR_SIGNUP}';render()">Registrar-se</button></p>
      </div>
    `;
  }

  return `
    <div class="stats">
      <span>📊 ${totalReports} denúncias totais</span>
      <span>📍 ${reportsWithLocation} com localização</span>
    </div>

    <button class="btn-red" onclick="state.screen='${SCREENS.REPORT}';render()">
      ➕ Nova denúncia
    </button>

    <div class="filters">
      <label>Filtro por Categoria:</label>
      <select onchange="setCategoryFilter(this.value)">
        <option value="all" ${state.categoryFilter === 'all' ? 'selected' : ''}>Todas</option>
        <option value="Infraestrutura" ${state.categoryFilter === 'Infraestrutura' ? 'selected' : ''}>Infraestrutura</option>
        <option value="Segurança" ${state.categoryFilter === 'Segurança' ? 'selected' : ''}>Segurança</option>
        <option value="Saúde" ${state.categoryFilter === 'Saúde' ? 'selected' : ''}>Saúde</option>
        <option value="Meio Ambiente" ${state.categoryFilter === 'Meio Ambiente' ? 'selected' : ''}>Meio Ambiente</option>
        <option value="Outros" ${state.categoryFilter === 'Outros' ? 'selected' : ''}>Outros</option>
      </select>

      <label>Filtro por Status:</label>
      <select onchange="setStatusFilter(this.value)">
        <option value="all" ${state.statusFilter === 'all' ? 'selected' : ''}>Todos</option>
        <option value="${REPORT_STATUS.PENDING}" ${state.statusFilter === REPORT_STATUS.PENDING ? 'selected' : ''}>Pendente</option>
        <option value="${REPORT_STATUS.IN_REVIEW}" ${state.statusFilter === REPORT_STATUS.IN_REVIEW ? 'selected' : ''}>Em Revisão</option>
        <option value="${REPORT_STATUS.IN_PROGRESS}" ${state.statusFilter === REPORT_STATUS.IN_PROGRESS ? 'selected' : ''}>Em Andamento</option>
        <option value="${REPORT_STATUS.RESOLVED}" ${state.statusFilter === REPORT_STATUS.RESOLVED ? 'selected' : ''}>Resolvido</option>
      </select>
    </div>

    <h3>📍 Denúncias Recentes</h3>

    <div class="reports-grid">
      ${filteredReports.map(r => `
        <div class="report-card">
          <div class="card-header">
            <strong>${r.title}</strong>
            <span class="votes">👍 ${r.votes}</span>
            <span class="status-badge" style="background-color: ${getStatusColor(r.status)}">${getStatusLabel(r.status)}</span>
          </div>
          <p class="report-info">
            ${r.category ? `<span class="category">${r.category}</span> • ` : ""}${r.location ? `${r.location.lat.toFixed(2)}, ${r.location.lng.toFixed(2)}` : "Sem localização"} • ${r.userName || r.user}
          </p>
          ${r.value > 0 ? `
            <div class="report-value-section">
              <div class="value-offer">💰 Oferecido: <strong>R$ ${r.value.toFixed(2)}</strong></div>
              <div class="value-total">Total com taxa: <strong>R$ ${r.totalValue.toFixed(2)}</strong></div>
            </div>
          ` : ""}
          ${r.photo ? `<img class="report-img" src="${r.photo}" alt="Foto da denúncia">` : ""}
          <div class="card-actions">
            ${r.location ? `<button class="btn-small" onclick="openLocation(${r.location.lat}, ${r.location.lng})">🧭 Abrir</button>` : ""}
            <button class="btn-small" onclick="vote(${r.id})">Votar</button>
            <button class="btn-small comments-btn" onclick="showCommentsModal(${r.id})">💬 ${r.comments ? r.comments.length : 0}</button>
            <button class="btn-small status-btn" onclick="showStatusModal(${r.id})">📋 Status</button>
            ${r.value > 0 ? `<button class="btn-small negotiate-btn" onclick="showNegotiateModal(${r.id})">💰 Negociar</button>` : ""}
          </div>
        </div>
      `).join("")}
    </div>

    <h3>🚨 Ligações de Emergência</h3>
    <div class="emergency-buttons">
      <button class="emergency-btn police" onclick="window.location.href='tel:190'">
        👮 Polícia<br>190
      </button>
      <button class="emergency-btn fire" onclick="window.location.href='tel:193'">
        🚒 Bombeiros<br>193
      </button>
      <button class="emergency-btn ambulance" onclick="window.location.href='tel:192'">
        🚑 Ambulância<br>192
      </button>
      <button class="emergency-btn zoonoses" onclick="window.location.href='tel:156'">
        🐕 Zoonoses<br>156
      </button>
    </div>
  `;
}

function updateReportStatus(id, newStatus, note = "") {
  const oldReport = state.reports.find(r => r.id === id);
  const oldStatus = oldReport ? oldReport.status : null;

  state.reports = state.reports.map(r => {
    if (r.id === id) {
      const updatedReport = { ...r, status: newStatus };
      if (!updatedReport.statusHistory) {
        updatedReport.statusHistory = [];
      }
      updatedReport.statusHistory.push({
        status: newStatus,
        date: new Date().toISOString(),
        note: note || `Status alterado para ${getStatusLabel(newStatus)}`
      });
      return updatedReport;
    }
    return r;
  });

  // Notificar mudança de status
  if (oldStatus !== newStatus) {
    notifyStatusChange(id, newStatus);
  }

  saveReports();
  render();
}

function getStatusLabel(status) {
  const labels = {
    [REPORT_STATUS.PENDING]: "Pendente",
    [REPORT_STATUS.IN_REVIEW]: "Em Análise",
    [REPORT_STATUS.IN_PROGRESS]: "Em Execução",
    [REPORT_STATUS.RESOLVED]: "Resolvida"
  };
  return labels[status] || status;
}

function getStatusColor(status) {
  const colors = {
    [REPORT_STATUS.PENDING]: "#ff9800",
    [REPORT_STATUS.IN_REVIEW]: "#2196f3",
    [REPORT_STATUS.IN_PROGRESS]: "#ff5722",
    [REPORT_STATUS.RESOLVED]: "#4caf50"
  };
  return colors[status] || "#666";
}

// LOGIN
function handleLogin() {
  if (!state.email || !state.password) {
    alert("Preencha email e senha!");
    return;
  }
  if (!state.email.includes("@")) {
    alert("Email inválido!");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const collaborators = JSON.parse(localStorage.getItem("collaborators") || "[]");
  
  // Procurar nas contas normais
  const normalUser = users.find(u => u.email === state.email && u.password === state.password);
  if (normalUser) {
    state.user = { email: state.email, type: "normal", name: normalUser.name || state.email };
    localStorage.setItem("user", JSON.stringify(state.user));
    showNotification("Login bem-sucedido!", `Bem-vindo, usuário normal! 👤`, "success");
    render();
    return;
  }
  
  // Procurar nas contas de colaborador
  const collaboratorUser = collaborators.find(u => u.email === state.email && u.password === state.password);
  if (collaboratorUser) {
    state.user = { email: state.email, type: "collaborator", name: collaboratorUser.name || collaboratorUser.company, company: collaboratorUser.company };
    localStorage.setItem("user", JSON.stringify(state.user));
    showNotification("Login bem-sucedido!", `Bem-vindo, colaborador! 🏢 ${collaboratorUser.company}`, "success");
    render();
    return;
  }
  
  alert("Email ou senha incorretos!");
}

function handleLogout() {
  localStorage.removeItem("user");
  state.user = null;
  render();
}

// CADASTRO
function handleSignup() {
  const email = prompt("Digite seu email para cadastro:");
  if (!email || !email.includes("@")) {
    alert("Email inválido!");
    return;
  }
  const name = prompt("Digite seu nome:");
  if (!name) {
    alert("Nome é obrigatório!");
    return;
  }
  const password = prompt("Digite uma senha:");
  if (!password || password.length < 6) {
    alert("Senha deve ter pelo menos 6 caracteres!");
    return;
  }
  // Simula cadastro salvando no localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(u => u.email === email)) {
    alert("Usuário já cadastrado!");
    return;
  }
  users.push({ email, password, name, type: "normal" });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Cadastro realizado! Faça login.");
}

function handleCollaboratorSignup() {
  const { name, email, password, company, cnpj, services } = state.collaboratorSignup;
  if (!name || !email || !password || !company || !cnpj || !services) {
    alert("Preencha todos os campos!");
    return;
  }
  if (!email.includes("@")) {
    alert("Email inválido!");
    return;
  }
  if (password.length < 6) {
    alert("Senha deve ter pelo menos 6 caracteres!");
    return;
  }
  if (state.collaborators.find(c => c.email === email)) {
    alert("Colaborador já cadastrado!");
    return;
  }
  state.collaborators.push({ name, email, password, company, cnpj, services, type: "collaborator" });
  saveCollaborators();
  state.collaboratorSignup = { name: "", email: "", password: "", company: "", cnpj: "", services: "" };
  alert("Cadastro de colaborador realizado!");
  state.screen = SCREENS.HOME;
  render();
}

// ESQUECI SENHA
function handleForgotPassword() {
  const email = prompt("Digite seu email cadastrado para recuperar a senha:");
  if (!email || !email.includes("@")) {
    alert("Email inválido!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    alert("Email não encontrado!");
    return;
  }

  const newPassword = prompt("Digite a nova senha (mínimo 6 caracteres):");
  if (!newPassword || newPassword.length < 6) {
    alert("Senha deve ter pelo menos 6 caracteres.");
    return;
  }

  users[userIndex].password = newPassword;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Senha alterada com sucesso! Faça login com sua nova senha.");
}

// NOTIFICAÇÕES
function initNotifications() {
  // Carregar configurações salvas
  const savedNotifications = localStorage.getItem("notifications");
  if (savedNotifications) {
    state.notifications = { ...state.notifications, ...JSON.parse(savedNotifications) };
  }

  // Verificar permissão atual
  if ('Notification' in window) {
    state.notifications.permission = Notification.permission;
  }
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('Este navegador não suporta notificações push.');
    return;
  }

  Notification.requestPermission().then(permission => {
    state.notifications.permission = permission;
    if (permission === 'granted') {
      state.notifications.enabled = true;
      showNotification('Notificações ativadas!', 'Agora você receberá alertas sobre suas denúncias.', 'success');
    } else {
      state.notifications.enabled = false;
      alert('Permissão de notificações negada. Você pode ativar nas configurações do navegador.');
    }
    saveNotificationSettings();
    render();
  });
}

function toggleNotifications() {
  if (state.notifications.permission !== 'granted') {
    requestNotificationPermission();
    return;
  }

  state.notifications.enabled = !state.notifications.enabled;
  const message = state.notifications.enabled ?
    'Notificações ativadas!' : 'Notificações desativadas!';
  showNotification(message, '', 'info');
  saveNotificationSettings();
  render();
}

function showNotification(title, body, type = 'info') {
  if (!state.notifications.enabled || state.notifications.permission !== 'granted') {
    return;
  }

  const notification = new Notification(title, {
    body: body,
    icon: '/favicon.ico', // Você pode adicionar um ícone
    badge: '/favicon.ico',
    tag: type, // Evita notificações duplicadas do mesmo tipo
    requireInteraction: type === 'important'
  });

  // Adicionar ao histórico
  addNotificationToHistory({
    title,
    body,
    type,
    timestamp: new Date().toISOString(),
    read: false
  });

  // Auto-fechar após 5 segundos (exceto notificações importantes)
  if (type !== 'important') {
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  // Quando clicar na notificação
  notification.onclick = function() {
    window.focus();
    notification.close();
  };
}

function addNotificationToHistory(notification) {
  state.notifications.history.unshift(notification);

  // Manter apenas as últimas 10 notificações
  if (state.notifications.history.length > 10) {
    state.notifications.history = state.notifications.history.slice(0, 10);
  }

  saveNotificationSettings();
}

function saveNotificationSettings() {
  localStorage.setItem("notifications", JSON.stringify({
    enabled: state.notifications.enabled,
    permission: state.notifications.permission,
    history: state.notifications.history
  }));
}

function markNotificationAsRead(index) {
  if (state.notifications.history[index]) {
    state.notifications.history[index].read = true;
    saveNotificationSettings();
    render();
  }
}

function clearNotificationHistory() {
  state.notifications.history = [];
  saveNotificationSettings();
  render();
}

function showNotificationsModal() {
  const modal = document.createElement("div");
  modal.className = "notifications-modal";
  modal.innerHTML = `
    <div class="notifications-modal-content">
      <h3>🔔 Notificações</h3>

      <div class="notification-settings">
        <div class="setting-item">
          <label>
            <input type="checkbox" ${state.notifications.enabled ? 'checked' : ''} onchange="toggleNotifications()">
            Receber notificações push
          </label>
        </div>
        <div class="setting-status">
          Status: <span class="status-${state.notifications.permission}">${getPermissionLabel(state.notifications.permission)}</span>
        </div>
      </div>

      <div class="notifications-history">
        <div class="history-header">
          <h4>Histórico de Notificações</h4>
          <button class="btn-small" onclick="clearNotificationHistory()">Limpar</button>
        </div>

        <div class="history-list">
          ${state.notifications.history.length > 0 ?
            state.notifications.history.map((n, index) => `
              <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="markNotificationAsRead(${index})">
                <div class="notification-icon ${n.type}">${getNotificationIcon(n.type)}</div>
                <div class="notification-content">
                  <div class="notification-title">${n.title}</div>
                  <div class="notification-body">${n.body}</div>
                  <div class="notification-time">${new Date(n.timestamp).toLocaleString('pt-BR')}</div>
                </div>
                ${!n.read ? '<div class="unread-dot"></div>' : ''}
              </div>
            `).join('') :
            '<p class="no-notifications">Nenhuma notificação ainda.</p>'
          }
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-default" onclick="this.closest('.notifications-modal').remove()">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function getPermissionLabel(permission) {
  const labels = {
    'granted': 'Permitido',
    'denied': 'Negado',
    'default': 'Pendente'
  };
  return labels[permission] || permission;
}

function getNotificationIcon(type) {
  const icons = {
    'success': '✅',
    'error': '❌',
    'warning': '⚠️',
    'info': 'ℹ️',
    'important': '🚨'
  };
  return icons[type] || '🔔';
}

// Integração com outras funções
function notifyStatusChange(reportId, newStatus) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report || !state.user) return;

  // Só notificar se o usuário criou a denúncia
  if (report.user !== state.user.email) return;

  const statusLabel = getStatusLabel(newStatus);
  showNotification(
    `Status da denúncia atualizado!`,
    `"${report.title}" mudou para: ${statusLabel}`,
    'info'
  );
}

function notifyNewComment(reportId, comment) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report || !state.user) return;

  // Só notificar se o usuário criou a denúncia e não foi ele quem comentou
  if (report.user !== state.user.email || comment.author === state.user.email) return;

  showNotification(
    `Novo comentário na sua denúncia!`,
    `"${report.title}" recebeu um comentário de ${comment.author}`,
    'info'
  );
}

function notifyNewVote(reportId) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report || !state.user) return;

  // Só notificar se o usuário criou a denúncia
  if (report.user !== state.user.email) return;

  showNotification(
    `Sua denúncia recebeu um voto!`,
    `"${report.title}" agora tem ${report.votes} votos`,
    'success'
  );
}

// 📍 LOCALIZAÇÃO
function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada!");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.locationData = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      alert("Localização capturada!");
    },
    (err) => {
      alert("Erro ao obter localização: " + err.message);
    }
  );
}

// 📸 CÂMERA REAL
async function openCamera() {
  try {
    const video = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert("Erro ao acessar câmera: " + err.message);
  }
}

function takePhoto() {
  const video = document.getElementById("video");
  if (!video.srcObject) {
    alert("Abra a câmera primeiro!");
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);
  state.photo = canvas.toDataURL("image/png");
  render();
}

// SELECIONAR FOTO DA GALERIA
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.photo = e.target.result;
      render();
    };
    reader.readAsDataURL(file);
  }
}

function clearPhoto() {
  state.photo = null;
  render();
}

// ADD REPORT
function addReport() {
  if (!state.newReport.title.trim()) {
    alert("Título é obrigatório!");
    return;
  }
  if (!state.newReport.description.trim()) {
    alert("Descrição é obrigatória!");
    return;
  }

  const reportValue = parseFloat(state.newReport.value) || 0;
  const developerFee = reportValue * 0.10;
  const totalValue = reportValue + developerFee;

  const report = {
    id: Date.now(),
    title: state.newReport.title.trim(),
    description: state.newReport.description.trim(),
    category: state.newReport.category,
    location: state.locationData,
    votes: 0,
    user: state.user.email,
    userName: state.user.name || state.user.email,
    userType: state.user.type,
    photo: state.photo,
    status: REPORT_STATUS.PENDING,
    statusHistory: [{
      status: REPORT_STATUS.PENDING,
      date: new Date().toISOString(),
      note: "Denúncia criada"
    }],
    comments: [],
    value: reportValue,
    developerFee: developerFee,
    totalValue: totalValue,
    negotiations: [],
    acceptedOffer: null
  };

  state.reports.unshift(report);
  saveReports();

  state.newReport = { title: "", description: "", category: "", value: 0 };
  state.locationData = null;
  state.photo = null;
  state.screen = SCREENS.HOME;

  render();
}

// VOTE
function vote(id) {
  if (localStorage.getItem("voted_" + id)) {
    alert("Você já votou!");
    return;
  }

  localStorage.setItem("voted_" + id, "true");

  state.reports = state.reports.map(r =>
    r.id === id ? { ...r, votes: r.votes + 1 } : r
  );

  // Notificar novo voto
  notifyNewVote(id);

  saveReports();
  render();
}

// ABRIR LOCALIZAÇÃO
function openLocation(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}

// TOGGLE MENU PERFIL
function toggleProfileMenu() {
  const dropdown = document.getElementById("profile-dropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

// VER PERFIL
function viewProfile() {
  alert(`Perfil: ${state.user.email}`);
  toggleProfileMenu();
}

// ALTERAR SENHA
function changePassword() {
  const newPassword = prompt("Digite a nova senha:");
  if (newPassword && newPassword.length >= 6) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.email === state.user.email);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Senha alterada!");
    }
  } else {
    alert("Senha deve ter pelo menos 6 caracteres.");
  }
  toggleProfileMenu();
}

// IDIOMA
function changeLanguage() {
  alert("Funcionalidade de idioma em desenvolvimento.");
  toggleProfileMenu();
}

function showStatusModal(reportId) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report) return;

  const modal = document.createElement("div");
  modal.className = "status-modal";
  modal.innerHTML = `
    <div class="status-modal-content">
      <h3>Gerenciar Status da Denúncia</h3>
      <p><strong>${report.title}</strong></p>

      <div class="status-options">
        <button onclick="updateReportStatus(${reportId}, '${REPORT_STATUS.PENDING}')" class="${report.status === REPORT_STATUS.PENDING ? 'active' : ''}" style="background-color: ${getStatusColor(REPORT_STATUS.PENDING)}">
          Pendente
        </button>
        <button onclick="updateReportStatus(${reportId}, '${REPORT_STATUS.IN_REVIEW}')" class="${report.status === REPORT_STATUS.IN_REVIEW ? 'active' : ''}" style="background-color: ${getStatusColor(REPORT_STATUS.IN_REVIEW)}">
          Em Análise
        </button>
        <button onclick="updateReportStatus(${reportId}, '${REPORT_STATUS.IN_PROGRESS}')" class="${report.status === REPORT_STATUS.IN_PROGRESS ? 'active' : ''}" style="background-color: ${getStatusColor(REPORT_STATUS.IN_PROGRESS)}">
          Em Execução
        </button>
        <button onclick="updateReportStatus(${reportId}, '${REPORT_STATUS.RESOLVED}')" class="${report.status === REPORT_STATUS.RESOLVED ? 'active' : ''}" style="background-color: ${getStatusColor(REPORT_STATUS.RESOLVED)}">
          Resolvida
        </button>
      </div>

      <div class="status-history">
        <h4>Histórico:</h4>
        ${report.statusHistory ? report.statusHistory.map(h => `
          <div class="history-item">
            <span class="history-status" style="background-color: ${getStatusColor(h.status)}">${getStatusLabel(h.status)}</span>
            <span class="history-date">${new Date(h.date).toLocaleString('pt-BR')}</span>
            <span class="history-note">${h.note}</span>
          </div>
        `).join('') : '<p>Sem histórico</p>'}
      </div>

      <button class="btn-default" onclick="this.closest('.status-modal').remove()">Fechar</button>
    </div>
  `;

  document.body.appendChild(modal);
}

function addComment(reportId, commentText) {
  if (!commentText.trim()) {
    alert("Comentário não pode estar vazio!");
    return;
  }

  let newCommentData = null;

  state.reports = state.reports.map(r => {
    if (r.id === reportId) {
      const newComment = {
        id: Date.now(),
        text: commentText.trim(),
        author: state.user.email,
        date: new Date().toISOString(),
        authorType: "user" // pode ser "user" ou "company"
      };

      newCommentData = newComment;

      return {
        ...r,
        comments: [...(r.comments || []), newComment]
      };
    }
    return r;
  });

  // Notificar novo comentário
  if (newCommentData) {
    notifyNewComment(reportId, newCommentData);
  }

  saveReports();
  render();
}

function showCommentsModal(reportId) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report) return;

  const modal = document.createElement("div");
  modal.className = "comments-modal";
  modal.innerHTML = `
    <div class="comments-modal-content">
      <h3>💬 Comentários - ${report.title}</h3>

      <div class="comments-list">
        ${report.comments && report.comments.length > 0 ?
          report.comments.map(c => `
            <div class="comment-item">
              <div class="comment-header">
                <strong>${c.author}</strong>
                <span class="comment-date">${new Date(c.date).toLocaleString('pt-BR')}</span>
                ${c.authorType === 'company' ? '<span class="company-badge">🏢 Empresa</span>' : '<span class="user-badge">👤 Usuário</span>'}
              </div>
              <div class="comment-text">${c.text}</div>
            </div>
          `).join('') :
          '<p class="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>'
        }
      </div>

      <div class="comment-form">
        <textarea id="new-comment-${reportId}" placeholder="Digite seu comentário..." rows="3" maxlength="500"></textarea>
        <div class="comment-actions">
          <span id="char-count-${reportId}" class="char-count">500</span>
          <button class="btn-green" onclick="submitComment(${reportId})">Enviar Comentário</button>
          <button class="btn-default" onclick="this.closest('.comments-modal').remove()">Fechar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Adicionar contador de caracteres
  const textarea = document.getElementById(`new-comment-${reportId}`);
  const charCount = document.getElementById(`char-count-${reportId}`);

  textarea.addEventListener('input', function() {
    charCount.textContent = 500 - this.value.length;
  });
}

function submitComment(reportId) {
  const textarea = document.getElementById(`new-comment-${reportId}`);
  const commentText = textarea.value.trim();

  if (commentText) {
    addComment(reportId, commentText);
    textarea.value = '';
    document.getElementById(`char-count-${reportId}`).textContent = '500';
  }
}

// NEGOCIAÇÃO DE VALORES
function showNegotiateModal(reportId) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report) return;

  const modal = document.createElement("div");
  modal.className = "negotiate-modal";
  modal.innerHTML = `
    <div class="negotiate-modal-content">
      <h3>💰 Negociação de Valor - ${report.title}</h3>
      
      <div class="current-offer">
        <h4>Oferta Atual</h4>
        <div class="offer-box">
          <p>Valor oferecido: <strong>R$ ${report.value.toFixed(2)}</strong></p>
          <p>Taxa desenvolvedores (10%): <strong>R$ ${report.developerFee.toFixed(2)}</strong></p>
          <p class="total">Total: <strong>R$ ${report.totalValue.toFixed(2)}</strong></p>
          <p class="offer-status">Anunciante: ${report.userName || report.user}</p>
        </div>
      </div>

      ${report.negotiations && report.negotiations.length > 0 ? `
        <div class="negotiations-history">
          <h4>Histórico de Negociações</h4>
          ${report.negotiations.map((n, i) => `
            <div class="negotiation-item">
              <p><strong>${n.proposedBy}</strong> (${n.userType === 'collaborator' ? '🏢' : '👤'}) propôs:</p>
              <p>Novo valor: <strong>R$ ${n.proposedValue.toFixed(2)}</strong></p>
              <p class="nego-status">Status: ${n.status === 'pending' ? '⏳ Pendente' : n.status === 'accepted' ? '✅ Aceito' : '❌ Rejeitado'}</p>
              ${n.message ? `<p class="nego-message">Mensagem: ${n.message}</p>` : ''}\n            </div>\n          `).join('')}\n        </div>\n      ` : ''}

      <div class="propose-new">        <h4>Fazer Nova Proposta</h4>
        <div class="form-group">\n          <label>Valor proposto (R$)</label>\n          <input id="propose-value-${reportId}" class="login-input" type="number" step="0.01" min="0" placeholder="Novo valor">
        </div>
        <div class="form-group">\n          <label>Mensagem (opcional)</label>\n          <textarea id="propose-message-${reportId}" class="login-input textarea-large" placeholder="Digite sua mensagem de negociação..." maxlength="300"></textarea>
        </div>
        <div class="negotiation-actions">\n          <button class="btn-green" onclick="proposeValue(${reportId})">Enviar Proposta</button>\n          <button class="btn-default" onclick="document.querySelector('.negotiate-modal').remove()">Fechar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function proposeValue(reportId) {
  const proposedValue = parseFloat(document.getElementById(`propose-value-${reportId}`).value);
  const proposedMessage = document.getElementById(`propose-message-${reportId}`).value.trim();

  if (isNaN(proposedValue) || proposedValue < 0) {
    alert("Digite um valor válido!");
    return;
  }

  const report = state.reports.find(r => r.id === reportId);
  if (!report) return;

  const negotiation = {
    id: Date.now(),
    proposedBy: state.user.name || state.user.email,
    userType: state.user.type,
    proposedValue: proposedValue,
    message: proposedMessage,
    status: 'pending',
    date: new Date().toISOString()
  };

  if (!report.negotiations) {
    report.negotiations = [];
  }
  report.negotiations.push(negotiation);

  saveReports();
  showNotification("Proposta enviada!", `Sua contra-proposta de R$ ${proposedValue.toFixed(2)} foi enviada`, "success");
  
  document.querySelector(".negotiate-modal").remove();
  render();
}

// 🗺️ CRIAR MAPA
function loadMap() {
  if (state.map) state.map.remove();

  state.map = L.map("map").setView([-7.1, -34.8], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(state.map);

  state.reports.forEach(r => {
    if (r.location) {
      L.marker([r.location.lat, r.location.lng])
        .addTo(state.map)
        .bindPopup(`
          <b>${r.title}</b><br/>
          ${r.description || ""}
        `);
    }
  });
}

// RENDER FUNCTIONS
function renderLogin() {
  return `
    <div style="position: relative; height: 100vh;">
      <button class="support-btn" onclick="window.location.href='mailto:suporte@cidadealerta.com'" title="Contato com Suporte">📧 Suporte</button>
      <div class="login-container">
        <h1 class="project-title">🚨 Cidade Alerta</h1>
        <input class="login-input" placeholder="Email" oninput="state.email=this.value" value="${state.email}">
        <input class="login-input" type="password" placeholder="Senha" oninput="state.password=this.value" onkeypress="if(event.key==='Enter') handleLogin()" value="${state.password}">
        <button class="btn-green" onclick="handleLogin()">Entrar</button>
        <button class="btn-default" onclick="handleSignup()">Cadastrar</button>
        <button class="btn-default" onclick="state.screen='${SCREENS.COLLABORATOR_SIGNUP}';render()">Registrar Colaborador</button>
        <button class="btn-default" onclick="handleForgotPassword()">Esqueci a senha</button>
      </div>
    </div>
  `;
}

function renderCollaboratorSignup() {
  return `
    <div style="position: relative; height: 100vh;">
      <button class="support-btn" onclick="window.location.href='mailto:suporte@cidadealerta.com'" title="Contato com Suporte">📧 Suporte</button>
      <div class="login-container">
        <h1 class="project-title">🚨 Cadastro de Colaborador</h1>
        <input class="login-input" placeholder="Nome" oninput="state.collaboratorSignup.name=this.value" value="${state.collaboratorSignup.name}">
        <input class="login-input" placeholder="Email" oninput="state.collaboratorSignup.email=this.value" value="${state.collaboratorSignup.email}">
        <input class="login-input" type="password" placeholder="Senha" oninput="state.collaboratorSignup.password=this.value" value="${state.collaboratorSignup.password}">
        <input class="login-input" placeholder="Empresa" oninput="state.collaboratorSignup.company=this.value" value="${state.collaboratorSignup.company}">
        <input class="login-input" placeholder="CNPJ" oninput="state.collaboratorSignup.cnpj=this.value" value="${state.collaboratorSignup.cnpj}">
        <input class="login-input" placeholder="Serviços" oninput="state.collaboratorSignup.services=this.value" value="${state.collaboratorSignup.services}">
        <button class="btn-green" onclick="handleCollaboratorSignup()">Cadastrar</button>
        <button class="btn-default" onclick="state.screen=SCREENS.HOME;render()">Voltar</button>
      </div>
    </div>
  `;
}

function renderHome() {
  const unreadCount = state.notifications.history.filter(n => !n.read).length;
  const accountTypeLabel = state.user.type === 'collaborator' ? '🏢 Colaborador' : '👤 Usuário Normal';
  const accountTypeClass = state.user.type === 'collaborator' ? 'account-type-collaborator' : 'account-type-normal';

  return `
    <div class="header">
      <div class="header-left">
        <div class="account-type-display ${accountTypeClass}">
          ${accountTypeLabel}
        </div>
        <button class="notification-btn ${state.notifications.enabled ? 'enabled' : ''}" onclick="showNotificationsModal()" title="Notificações">
          🔔${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
        </button>
      </div>
      <h1 class="animated-title">🚨 Cidade Alerta</h1>
      <div class="header-actions">
        <div class="profile-menu">
          <button class="profile-btn" onclick="toggleProfileMenu()">👤</button>
          <div id="profile-dropdown" class="dropdown-content" style="display:none;">
            <button onclick="viewProfile()">Ver Perfil</button>
            <button onclick="changePassword()">Alterar Senha</button>
            <button onclick="changeLanguage()">Idioma</button>
            <button onclick="handleLogout()">Sair</button>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-bar">
      <button class="tab-button ${state.homeTab === HOME_TABS.MAIN ? "active" : ""}" onclick="setHomeTab('${HOME_TABS.MAIN}')">Página Inicial</button>
      <button class="tab-button ${state.homeTab === HOME_TABS.DEVELOPERS ? "active" : ""}" onclick="setHomeTab('${HOME_TABS.DEVELOPERS}')">Desenvolvedores</button>
      <button class="tab-button ${state.homeTab === HOME_TABS.DONATIONS ? "active" : ""}" onclick="setHomeTab('${HOME_TABS.DONATIONS}')">Doações</button>
      <button class="tab-button ${state.homeTab === HOME_TABS.ABOUT ? "active" : ""}" onclick="setHomeTab('${HOME_TABS.ABOUT}')">Sobre</button>
      <button class="tab-button ${state.homeTab === HOME_TABS.COLLABORATORS ? "active" : ""}" onclick="setHomeTab('${HOME_TABS.COLLABORATORS}')">Colaboradores</button>
    </div>

    <div class="home-tab-content">
      ${renderHomeTabContent()}
  `;
}

function renderReport() {
  return `
    <div class="report-form">
      <h2>Nova denúncia</h2>

      <div class="form-group">
        <label for="title">Título *</label>
        <input id="title" class="login-input" placeholder="Digite o título da denúncia" oninput="state.newReport.title=this.value" value="${state.newReport.title}">
      </div>

      <div class="form-group">
        <label for="category">Categoria</label>
        <select id="category" class="login-input" onchange="state.newReport.category=this.value; render()">
          <option value="">Selecione uma categoria</option>
          <option value="Infraestrutura" ${state.newReport.category === "Infraestrutura" ? "selected" : ""}>Infraestrutura</option>
          <option value="Segurança" ${state.newReport.category === "Segurança" ? "selected" : ""}>Segurança</option>
          <option value="Saúde" ${state.newReport.category === "Saúde" ? "selected" : ""}>Saúde</option>
          <option value="Meio Ambiente" ${state.newReport.category === "Meio Ambiente" ? "selected" : ""}>Meio Ambiente</option>
          <option value="Serviços" ${state.newReport.category === "Serviços" ? "selected" : ""}>Serviços</option>
          <option value="Outros" ${state.newReport.category === "Outros" ? "selected" : ""}>Outros</option>
        </select>
      </div>

      ${state.newReport.category === "Serviços" ? `
        <div class="form-group">
          <label for="subcategory">Sub categoria de Serviço *</label>
          <select id="subcategory" class="login-input" onchange="state.newReport.subcategory=this.value; render()">
            <option value="">Selecione um serviço</option>
            <option value="Encanamento" ${state.newReport.subcategory === "Encanamento" ? "selected" : ""}>Encanamento</option>
            <option value="Elétrica" ${state.newReport.subcategory === "Elétrica" ? "selected" : ""}>Elétrica</option>
            <option value="Carpintaria" ${state.newReport.subcategory === "Carpintaria" ? "selected" : ""}>Carpintaria</option>
            <option value="Pintura" ${state.newReport.subcategory === "Pintura" ? "selected" : ""}>Pintura</option>
            <option value="Limpeza" ${state.newReport.subcategory === "Limpeza" ? "selected" : ""}>Limpeza</option>
            <option value="Manutenção" ${state.newReport.subcategory === "Manutenção" ? "selected" : ""}>Manutenção Geral</option>
            <option value="Outro Serviço" ${state.newReport.subcategory === "Outro Serviço" ? "selected" : ""}>Outro Serviço</option>
          </select>
        </div>
      ` : ''}

      <div class="form-group">
        <label for="description">Descrição *</label>
        <textarea id="description" class="login-input textarea-large" placeholder="Descreva a denúncia em detalhes" oninput="state.newReport.description=this.value">${state.newReport.description}</textarea>
      </div>

      ${state.newReport.category === "Serviços" && state.newReport.subcategory ? `
        <div class="form-group">
          <label for="value">💰 Valor do Serviço *</label>
          <div class="value-input-group">
            <span class="currency-symbol">R$</span>
            <input id="value" class="login-input value-input" type="number" placeholder="0.00" step="0.01" min="0" oninput="state.newReport.value=this.value" value="${state.newReport.value}">
          </div>
          ${state.newReport.value ? `
            <div class="value-breakdown">
              <p>💵 Valor oferecido: <strong>R$ ${parseFloat(state.newReport.value).toFixed(2)}</strong></p>
              <p>👨‍💻 Taxa desenvolvedores (10%): <strong>R$ ${(parseFloat(state.newReport.value) * 0.10).toFixed(2)}</strong></p>
              <p class="total-value">📊 Total: <strong>R$ ${(parseFloat(state.newReport.value) * 1.10).toFixed(2)}</strong></p>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <div class="form-group">
        <button class="btn-default" onclick="getLocation()">
          📍 Pegar localização
        </button>
        ${state.locationData ? `<span class="location-info">Localização obtida: ${state.locationData.lat.toFixed(2)}, ${state.locationData.lng.toFixed(2)}</span>` : ""}
      </div>

      <div class="form-group">
        <h3>📸 Foto (opcional)</h3>
        <div class="camera-section">
          <video id="video" class="video-style" autoplay style="display:none;"></video>
          <div class="camera-controls">
            <button class="btn-default" onclick="openCamera()">Abrir câmera</button>
            <button class="btn-default" onclick="takePhoto()">Tirar foto</button>
          </div>
          <input type="file" accept="image/*" onchange="handleFileSelect(event)" style="margin-top:10px;">
          ${state.photo ? `
            <div class="photo-preview">
              <img class="preview-img" src="${state.photo}" alt="Prévia da foto">
              <button class="btn-small" onclick="clearPhoto()">Remover foto</button>
            </div>
          ` : ""}
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-green" onclick="addReport()">Enviar denúncia</button>
        <button class="btn-default" onclick="state.screen='${SCREENS.HOME}';render()">Voltar</button>
      </div>
    </div>
  `;
}

// MAIN RENDER
function render() {
  const app = document.getElementById("app");

  if (state.screen === SCREENS.COLLABORATOR_SIGNUP) {
    app.innerHTML = renderCollaboratorSignup();
    return;
  }

  if (!state.user) {
    app.innerHTML = renderLogin();
    return;
  }

  if (state.screen === SCREENS.HOME) {
    app.innerHTML = renderHome();
  } else if (state.screen === SCREENS.REPORT) {
    app.innerHTML = renderReport();
  }
}

init();
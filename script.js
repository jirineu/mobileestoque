document.addEventListener('DOMContentLoaded', () => {
    
    // --- FUNÇÃO CUSTOMIZADA DE TOAST (SUBSTITUI ALERT) ---
    function showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            // Cria o container se ele não existir
            const container = document.createElement('div');
            container.id = 'toastContainer';
            // Adiciona estilos básicos para o toastContainer (pode ser ajustado no style.css)
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '2000';
            container.style.maxWidth = '300px';
            document.body.appendChild(container);
            toastContainer = container;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        // Adiciona um estilo inline temporário (se não tiver no CSS)
        toast.style.padding = '10px 15px';
        toast.style.marginBottom = '10px';
        toast.style.borderRadius = '5px';
        toast.style.backgroundColor = type === 'success' ? '#4CAF50' : (type === 'error' ? '#f44336' : '#2196f3');
        toast.style.color = 'white';
        toast.style.opacity = '1';
        toast.style.transition = 'opacity 0.5s ease-out';


        toastContainer.appendChild(toast);

        // Auto-hide após 8 segundos (8000ms)
        setTimeout(() => {
            toast.style.opacity = '0';
            // Remove o elemento após a transição de saída
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 8000);
    }
    // --- FIM DA FUNÇÃO TOAST ---


    // --- Elementos Comuns da UI ---
    const sideMenu = document.getElementById('sideMenu');
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const navItems = document.querySelectorAll('.app-footer .nav-item');
    const sideMenuItems = document.querySelectorAll('.side-menu .menu-item');
    const userInfo = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Elementos de Autenticação ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    // --- Elementos de Vendas ---
    const produtoAddItemSelect = document.getElementById('produtoAddItem');
    const quantidadeAddItemInput = document.getElementById('quantidadeAddItem');
    const addItemForm = document.getElementById('addItemForm');
    const cartTableBody = document.getElementById('cartTableBody');
    const grandTotalSpan = document.getElementById('grandTotal');
    const cartCountSpan = document.getElementById('cartCount');
    const registerSaleBtn = document.getElementById('registerSaleBtn');
    const customerNameInput = document.getElementById('customerNameInput'); 
    
    // --- Elementos de Estoque e Edição ---
    const estoqueTableBody = document.getElementById('estoqueTableBody');
    const btnEntrada = document.getElementById('btnEntrada');
    const btnSaida = document.getElementById('btnSaida');
    const searchEstoqueInput = document.getElementById('searchEstoque');
    const movimentacaoFormContainer = document.getElementById('movimentacaoFormContainer');
    const movimentacaoForm = document.getElementById('movimentacaoForm');
    const movTitle = document.getElementById('movTitle');
    const movType = document.getElementById('movType');
    
    // Elementos de Movimentação por Busca
    const movSearchContainer = document.getElementById('movSearchContainer');
    const movSearchInput = document.getElementById('movSearchInput');
    const productListForMov = document.getElementById('productListForMov');
    const searchMovProductBtn = document.getElementById('searchMovProductBtn');
    const movProductDetails = document.getElementById('movProductDetails');
    const movProductId = document.getElementById('movProductId');
    const movProductNameDisplay = document.getElementById('movProductNameDisplay');
    const movProductQtyDisplay = document.getElementById('movProductQtyDisplay');
    const movQuantidade = document.getElementById('movQuantidade');
    const movCancelBtn = document.getElementById('movCancelBtn');


    // Elementos de Gerenciamento de Produtos (Search-based Edition)
    const searchEditProductForm = document.getElementById('searchEditProductForm');
    const searchEditProductInput = document.getElementById('searchEditProductInput');
    const productListForEdit = document.getElementById('productListForEdit');
    const gerenciarStatusMessage = document.getElementById('gerenciarStatusMessage');
    const edicaoFormContainer = document.getElementById('edicaoFormContainer');
    const edicaoForm = document.getElementById('edicaoForm');
    const edicaoProductName = document.getElementById('edicaoProductName');
    const editProductId = document.getElementById('editProductId');
    const editProductNameInput = document.getElementById('editProductName');
    const editProductPriceInput = document.getElementById('editProductPrice');
    const editProductWeightInput = document.getElementById('editProductWeight');
    const editCancelBtn = document.getElementById('editCancelBtn');
    const btnDeleteProduct = document.getElementById('btnDeleteProduct'); // Novo botão de Excluir


    // --- Elementos de Outras Páginas ---
    const addProdutoForm = document.getElementById('addProdutoForm');
    const inventarioProdutoSelect = document.getElementById('inventarioProduto');
    const inventarioForm = document.getElementById('inventarioForm');
    const registroVendasList = document.getElementById('registroVendasList'); 
    const searchRegistroVendasInput = document.getElementById('searchRegistroVendas'); // NOVO ELEMENTO
    const estoqueHistoricoList = document.getElementById('estoqueHistoricoList'); 
    const filterEstoqueHistoricoSelect = document.getElementById('filterEstoqueHistorico'); 


    // --- Elementos de Gerenciamento de Usuários (Master Only) ---
    const userTableBody = document.getElementById('userTableBody');
    const changePasswordFormContainer = document.getElementById('changePasswordFormContainer');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordUsernameSpan = document.getElementById('changePasswordUsername');
    const changePasswordUserIdInput = document.getElementById('changePasswordUserId');
    const newPasswordInput = document.getElementById('newPassword');
    const changePasswordCancelBtn = document.getElementById('changePasswordCancelBtn');


    // --- Variáveis de Estado ---
    let currentUser = null; 
    let currentCart = []; 

    // --- Persistência (Simulação com localStorage) ---
    let users = JSON.parse(localStorage.getItem('users')) || {
        'admin': { password: '455596', role: 'master' },
        'user': { password: '123', role: 'user' }
    };
    const saveUsers = () => localStorage.setItem('users', JSON.stringify(users));

    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 'prod001', name: 'Produto A', quantity: 10, price: 10.00, weightGrams: 100 },
        { id: 'prod002', name: 'Produto B', quantity: 5, price: 25.00, weightGrams: 250 },
        { id: 'prod003', name: 'Produto C', quantity: 20, price: 5.50, weightGrams: 50 }
    ];
    const saveProducts = () => localStorage.setItem('products', JSON.stringify(products));

    // Registro de Vendas
    let salesRegister = JSON.parse(localStorage.getItem('salesRegister')) || [];
    const saveSalesRegister = () => localStorage.setItem('salesRegister', JSON.stringify(salesRegister));
    
    // Histórico de Estoque
    let stockHistory = JSON.parse(localStorage.getItem('stockHistory')) || [];
    const saveStockHistory = () => localStorage.setItem('stockHistory', JSON.stringify(stockHistory));


    // --- Core Navigation and UI Functions ---

    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId + '-page');

        if (targetPage) {
            // Verifica permissão para admin-only
            if (targetPage.classList.contains('admin-only') && (!currentUser || currentUser.role !== 'master')) {
                showToast('Acesso restrito. Apenas Master pode acessar esta página.', 'error');
                showPage('home'); 
                return;
            }

            targetPage.classList.add('active');
            window.history.pushState(null, '', `#${pageId}`); 

            // Esconde todos os subformulários ao trocar de página
            if (movimentacaoFormContainer) movimentacaoFormContainer.classList.add('hidden');
            if (edicaoFormContainer) edicaoFormContainer.classList.add('hidden');
            if (changePasswordFormContainer) changePasswordFormContainer.classList.add('hidden');
            
            // Limpa a busca ao trocar de página
            if (searchEstoqueInput) searchEstoqueInput.value = '';
            if (searchRegistroVendasInput) searchRegistroVendasInput.value = ''; // Limpa a busca de vendas

            switch (pageId) {
                case 'vendas':
                    populateProductsForSale(); 
                    renderCart();
                    break;
                case 'estoque':
                    renderEstoqueTable();
                    break;
                case 'gerenciarProdutos': 
                    populateDatalistForEdit(); 
                    if (searchEditProductForm) searchEditProductForm.reset();
                    if (gerenciarStatusMessage) gerenciarStatusMessage.textContent = 'Use a busca acima para encontrar o produto que deseja editar ou excluir.';
                    break;
                case 'inventario':
                    populateInventarioProducts(); 
                    break;
                case 'registroVendas': 
                    renderSalesHistoryTable(); // Renderiza sem filtro inicialmente
                    break;
                case 'estoqueHistorico': 
                    renderStockHistoryTable();
                    break;
                case 'gerenciarUsuarios':
                    if (userTableBody) renderUserTable();
                    break;
            }
        }
        
        sideMenu.classList.remove('active');
        updateNavigation(pageId);
    }

    // ... (updateNavigation, toggleMenu, Authentication Logic permanecem os mesmos) ...
    function updateNavigation(activePageId) {
        navItems.forEach(item => {
            const href = item.getAttribute('href').substring(1);
            href === activePageId ? item.classList.add('active') : item.classList.remove('active');
        });
        sideMenuItems.forEach(item => {
            const href = item.getAttribute('href').substring(1);
            href === activePageId ? item.classList.add('active') : item.classList.remove('active');
        });
    }

    const toggleMenu = () => sideMenu.classList.toggle('active');

    function login(username, password) {
        if (users[username] && users[username].password === password) {
            currentUser = { username: username, role: users[username].role };
            localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
            updateUserInfo();
            showPage('home'); 
            checkUserPermissions();
            return true;
        }
        showToast('Usuário ou senha inválidos.', 'error');
        return false;
    }

    function register(username, password) {
        if (users[username]) { showToast('Usuário já existe.', 'error'); return false; }
        users[username] = { password: password, role: 'user' }; saveUsers();
        showToast('Cadastro realizado com sucesso! Faça login.', 'success'); showPage('login');
    }
    function logout() {
        currentUser = null; localStorage.removeItem('loggedInUser'); updateUserInfo();
        currentCart = []; showPage('login'); checkUserPermissions(); 
    }

    function updateUserInfo() {
        if (currentUser) {
            userInfo.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.username}`;
            userInfo.title = `Logado como: ${currentUser.username} (${currentUser.role})`;
        } else {
            userInfo.innerHTML = `<i class="fas fa-user-circle"></i>`;
            userInfo.title = `Não logado`;
        }
    }

    function checkUserPermissions() {
        const adminMenuElements = document.querySelectorAll('.side-menu li.admin-only');
        const adminPageElements = document.querySelectorAll('.app-content .page.admin-only');

        if (currentUser && currentUser.role === 'master') {
            adminMenuElements.forEach(el => el.style.display = 'block');
            adminPageElements.forEach(el => el.style.display = ''); 
        } else {
            adminMenuElements.forEach(el => el.style.display = 'none');
            adminPageElements.forEach(el => el.style.display = 'none'); 
        }
    }
    // --- Fim da Lógica de Autenticação/UI ---


    // --- Lógica de Vendas (Mantida a mesma) ---
    function populateProductsForSale() {
        if (!produtoAddItemSelect) return;
        produtoAddItemSelect.innerHTML = '<option value="">Selecione o produto</option>';
        products.forEach(product => {
            if (product.quantity > 0) { 
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (Estoque: ${product.quantity} / R$ ${product.price.toFixed(2)})`;
                produtoAddItemSelect.appendChild(option);
            }
        });
        if (produtoAddItemSelect.children.length === 1) {
             produtoAddItemSelect.innerHTML = '<option value="">Nenhum produto em estoque para venda</option>';
        }
    }
    function renderCart() {
        if (!cartTableBody || !grandTotalSpan || !cartCountSpan || !registerSaleBtn) return;

        cartTableBody.innerHTML = '';
        let grandTotal = 0;

        if (currentCart.length === 0) {
            cartTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-light);">Nenhum item no carrinho.</td></tr>`;
            grandTotalSpan.textContent = 'R$ 0.00';
            cartCountSpan.textContent = '0';
            registerSaleBtn.disabled = true;
            if (customerNameInput) customerNameInput.disabled = true;
            return;
        }

        currentCart.forEach((item, index) => {
            const subtotal = item.quantity * item.price;
            grandTotal += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R$ ${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn small-btn danger-btn" onclick="removeItemFromCart(${index})"><i class="fas fa-times"></i></button>
                </td>
            `;
            cartTableBody.appendChild(row);
        });

        grandTotalSpan.textContent = `R$ ${grandTotal.toFixed(2)}`;
        cartCountSpan.textContent = currentCart.length.toString();
        registerSaleBtn.disabled = false;
        if (customerNameInput) customerNameInput.disabled = false;
    }
    window.removeItemFromCart = (index) => {
        currentCart.splice(index, 1);
        populateProductsForSale(); 
        renderCart();
        showToast('Item removido do carrinho.', 'info');
    };
    if (addItemForm) {
        addItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const productId = produtoAddItemSelect.value;
            const quantity = parseInt(quantidadeAddItemInput.value);
            if (!productId || quantity <= 0) { showToast('Selecione um produto e uma quantidade válida.', 'error'); return; }
            const product = products.find(p => p.id === productId);
            if (!product) { showToast('Produto não encontrado.', 'error'); return; }
            if (quantity > product.quantity) { showToast(`Estoque insuficiente! Disponível: ${product.quantity}`, 'error'); return; }
            const cartItemIndex = currentCart.findIndex(item => item.id === productId);
            if (cartItemIndex > -1) {
                const newQuantity = currentCart[cartItemIndex].quantity + quantity;
                if (newQuantity > product.quantity) {
                     showToast(`Você só pode adicionar mais ${product.quantity - currentCart[cartItemIndex].quantity} unidades.`, 'error');
                     return;
                }
                currentCart[cartItemIndex].quantity = newQuantity;
            } else {
                currentCart.push({ id: product.id, name: product.name, quantity: quantity, price: product.price });
            }
            produtoAddItemSelect.value = '';
            quantidadeAddItemInput.value = '1';
            renderCart();
            showToast('Item adicionado ao carrinho.', 'success');
        });
    }
    if (registerSaleBtn) {
        registerSaleBtn.addEventListener('click', () => {
            if (currentCart.length === 0) { showToast('O carrinho está vazio.', 'error'); return; }
            const customerName = customerNameInput ? customerNameInput.value.trim() : '';
            if (!customerName) { showToast('O nome do cliente é obrigatório para registrar a venda.', 'error'); return; }
            const grandTotal = currentCart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            const saleTimestamp = new Date().toISOString();
            const transaction = {
                id: 'venda' + Date.now(), type: 'venda', customerName: customerName,
                items: currentCart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price, subtotal: item.quantity * item.price })),
                total: grandTotal, timestamp: saleTimestamp
            };
            salesRegister.push(transaction); saveSalesRegister();

            currentCart.forEach(cartItem => {
                const productIndex = products.findIndex(p => p.id === cartItem.id);
                if (productIndex !== -1) {
                    products[productIndex].quantity -= cartItem.quantity;
                    stockHistory.push({
                        id: 'estoque' + Date.now() + Math.random(), type: 'venda', productName: cartItem.name,
                        productId: cartItem.id, quantity: -cartItem.quantity, timestamp: saleTimestamp,
                        details: `Venda registrada para: ${customerName}`
                    });
                }
            });

            saveProducts(); saveStockHistory();
            currentCart = [];
            showToast(`Venda para ${customerName} registrada! Total: R$ ${grandTotal.toFixed(2)}`, 'success');
            if (customerNameInput) customerNameInput.value = '';
            populateProductsForSale(); renderCart(); showPage('home');
        });
    }
    // --- Fim da Lógica de Vendas ---


    // --- Lógica de Histórico ---
    function renderSalesHistoryTable(filterText = '') { // FUNÇÃO ATUALIZADA
        if (!registroVendasList) return;

        const lowerCaseFilter = filterText.toLowerCase().trim();
        registroVendasList.innerHTML = '';
        
        const filteredSales = salesRegister.slice().reverse().filter(transaction => {
            if (lowerCaseFilter === '') return true;

            // Busca por Nome do Cliente
            if (transaction.customerName && transaction.customerName.toLowerCase().includes(lowerCaseFilter)) {
                return true;
            }

            // Busca por Nome de Item Vendido
            const itemMatch = transaction.items.some(item => 
                item.name.toLowerCase().includes(lowerCaseFilter)
            );
            return itemMatch;
        });

        if (filteredSales.length === 0) {
            registroVendasList.innerHTML = `<p style="text-align:center; color: var(--text-light);">Nenhuma venda encontrada com o filtro: "${filterText}"</p>`;
            return;
        }
        
        filteredSales.forEach(transaction => {
            const date = new Date(transaction.timestamp).toLocaleString('pt-BR');
            let itemsText = transaction.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
            const listItem = document.createElement('li');
            listItem.className = 'history-list-item card'; 
            listItem.innerHTML = `
                <div class="history-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
                    <span class="type-venda btn small-btn"><i class="fas fa-receipt"></i> VENDA</span>
                    <span class="history-date" style="font-size: 0.9em; color: var(--text-light);">${date}</span>
                </div>
                <div class="history-details">
                    <p style="margin-top: 5px;"><strong>Cliente:</strong> ${transaction.customerName}</p>
                    <p><strong>Itens:</strong> ${itemsText}</p>
                    <p><strong>Total:</strong> <span style="color: var(--primary-color); font-weight: bold;">R$ ${transaction.total.toFixed(2)}</span></p>
                </div>
            `;
            registroVendasList.appendChild(listItem);
        });
    }
    
    // Função de filtro para Registro de Vendas
    const filterSalesHistory = () => {
        if (searchRegistroVendasInput) {
            renderSalesHistoryTable(searchRegistroVendasInput.value);
        }
    };

    if (searchRegistroVendasInput) {
        searchRegistroVendasInput.addEventListener('keyup', filterSalesHistory);
    }

    
    function renderStockHistoryTable() {
        if (!estoqueHistoricoList) return;

        const selectedType = filterEstoqueHistoricoSelect ? filterEstoqueHistoricoSelect.value : 'all';
        estoqueHistoricoList.innerHTML = '';

        if (stockHistory.length === 0) {
            estoqueHistoricoList.innerHTML = `<p style="text-align:center; color: var(--text-light);">Nenhuma movimentação de estoque registrada.</p>`;
            return;
        }

        const filteredHistory = stockHistory.slice().reverse().filter(item => 
            selectedType === 'all' || item.type === selectedType
        );

        if (filteredHistory.length === 0) {
            estoqueHistoricoList.innerHTML = `<p style="text-align:center; color: var(--text-light);">Nenhuma movimentação do tipo "${selectedType.toUpperCase()}" encontrada.</p>`;
            return;
        }

        filteredHistory.forEach(item => {
            const date = new Date(item.timestamp).toLocaleString('pt-BR');
            const isPositive = item.quantity > 0;
            const absQuantity = Math.abs(item.quantity);
            
            let typeText = '';
            let typeClass = '';
            let icon = '';

            switch(item.type) {
                case 'entrada':
                    typeText = 'ENTRADA';
                    typeClass = 'btn-success';
                    icon = '<i class="fas fa-arrow-up"></i>';
                    break;
                case 'saida':
                    typeText = 'SAÍDA (Perda/Dev)';
                    typeClass = 'btn-danger';
                    icon = '<i class="fas fa-arrow-down"></i>';
                    break;
                case 'venda':
                    typeText = 'SAÍDA (Venda)';
                    typeClass = 'btn-warning';
                    icon = '<i class="fas fa-shopping-cart"></i>';
                    break;
                case 'inventario':
                    typeText = `INVENTÁRIO (${isPositive ? 'AUMENTO' : 'REDUÇÃO'})`;
                    typeClass = isPositive ? 'btn-info' : 'btn-danger';
                    icon = '<i class="fas fa-check-double"></i>';
                    break;
                default:
                    typeText = 'MOVIMENTAÇÃO';
                    typeClass = 'btn-info';
                    icon = '<i class="fas fa-exchange-alt"></i>';
            }
            
            const listItem = document.createElement('li');
            listItem.className = 'history-list-item card'; 
            listItem.innerHTML = `
                <div class="history-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
                    <span class="type-badge btn small-btn ${typeClass}" style="color: black; font-weight: bold; background-color: ${typeClass === 'btn-success' ? '#8bc34a' : typeClass === 'btn-danger' ? '#f44336' : typeClass === 'btn-warning' ? '#ffc107' : '#2196f3'};">${icon} ${typeText}</span>
                    <span class="history-date" style="font-size: 0.9em; color: var(--text-light);">${date}</span>
                </div>
                <div class="history-details">
                    <p style="margin-top: 5px;"><strong>Produto:</strong> ${item.productName}</p>
                    <p><strong>Quantidade:</strong> <span style="font-weight: bold; color: ${isPositive ? 'var(--primary-color)' : 'var(--error-color)'}">${isPositive ? '+' : '-'}${absQuantity}</span></p>
                    <p style="font-size: 0.8em; color: var(--text-light);"><strong>Detalhes:</strong> ${item.details}</p>
                </div>
            `;
            estoqueHistoricoList.appendChild(listItem);
        });
    }

    if (filterEstoqueHistoricoSelect) {
        filterEstoqueHistoricoSelect.addEventListener('change', renderStockHistoryTable);
    }
    // --- Fim da Lógica de Histórico ---

    // --- Lógica de Estoque (Visualização Simples) ---
    function renderEstoqueTable(filterText = '') {
        if (!estoqueTableBody) return;
        
        estoqueTableBody.innerHTML = '';
        const lowerCaseFilter = filterText.toLowerCase();

        products.filter(product => 
            product.name.toLowerCase().includes(lowerCaseFilter)
        ).forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>R$ ${product.price.toFixed(2)}</td>
            `;
            estoqueTableBody.appendChild(row);
        });

        if (estoqueTableBody.children.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" style="text-align:center; color: var(--text-light);">Nenhum produto encontrado.</td>`;
            estoqueTableBody.appendChild(row);
        }
    }
    
    const filterEstoqueTable = () => {
        if (searchEstoqueInput) {
            renderEstoqueTable(searchEstoqueInput.value);
        }
    };
    if (searchEstoqueInput) {
        searchEstoqueInput.addEventListener('keyup', filterEstoqueTable);
    }


    // --- Lógica de Gerenciamento de Produtos (Search-based Edition) ---
    
    function populateDatalistForEdit() {
        if (!productListForEdit) return;

        productListForEdit.innerHTML = '';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = `${product.name} (Qtd: ${product.quantity})`;
            // Não usamos data-attribute aqui, apenas o nome para buscar
            productListForEdit.appendChild(option);
        });
    }

    function handleProductSearchForEdit(searchText) {
        if (!searchText) {
            if (edicaoFormContainer) edicaoFormContainer.classList.add('hidden');
            if (gerenciarStatusMessage) gerenciarStatusMessage.textContent = 'Digite e selecione o nome exato do produto na lista para carregar os dados.';
            return;
        }

        // Tenta encontrar o produto pelo nome exato (removendo a info de Qtd)
        const productName = searchText.split(' (Qtd:')[0].trim(); 
        const product = products.find(p => p.name.trim() === productName);

        if (product) {
            handleEditAll(product.id);
            if (gerenciarStatusMessage) gerenciarStatusMessage.textContent = `Dados de "${product.name}" carregados para edição.`;
        } else {
            if (edicaoFormContainer) edicaoFormContainer.classList.add('hidden');
            if (gerenciarStatusMessage) gerenciarStatusMessage.textContent = `Produto "${productName}" não encontrado. Tente digitar o nome exato.`;
        }
    }
    
    if (searchEditProductForm) {
        searchEditProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleProductSearchForEdit(searchEditProductInput.value.trim());
        });
    }

    // --- EDIÇÃO DE PRODUTO (Chamada pela Busca) ---
    
    // Handler que exibe o formulário de edição com todos os campos.
    window.handleEditAll = (id) => {
        const product = products.find(p => p.id === id);
        if (!product || !edicaoFormContainer) return;
        
        // Adiciona ou garante a visibilidade do campo de Quantidade
        let qtyField = document.getElementById('editProductQuantityContainer');
        if (!qtyField) {
            qtyField = document.createElement('div');
            qtyField.id = 'editProductQuantityContainer';
            qtyField.innerHTML = `
                <label for="editProductQuantity">Quantidade em Estoque:</label>
                <input type="number" id="editProductQuantity" min="0" required>
            `;
            const priceLabel = document.querySelector('#edicaoForm label[for="editProductPrice"]');
            priceLabel.parentNode.insertBefore(qtyField, priceLabel);
        }
        
        qtyField.classList.remove('hidden'); 
        
        document.getElementById('editProductQuantity').value = product.quantity;


        edicaoProductName.textContent = product.name;
        editProductId.value = product.id;
        editProductNameInput.value = product.name;
        editProductPriceInput.value = product.price.toFixed(2);
        editProductWeightInput.value = product.weightGrams || '';
        
        if (movimentacaoFormContainer) movimentacaoFormContainer.classList.add('hidden');
        edicaoFormContainer.classList.remove('hidden');
    };
    
    // Listener para o botão de Exclusão (movido para a tela de edição)
    if (btnDeleteProduct) {
        btnDeleteProduct.addEventListener('click', () => {
             const id = editProductId.value;
             const product = products.find(p => p.id === id);
             if(product) {
                 handleDelete(product.id, product.name, product.quantity);
             }
        });
    }

    if (edicaoForm) {
        edicaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = editProductId.value;
            const productIndex = products.findIndex(p => p.id === id);

            if (productIndex !== -1) {
                const product = products[productIndex];
                const oldQuantity = product.quantity;
                const newQuantity = parseInt(document.getElementById('editProductQuantity').value);


                product.name = editProductNameInput.value;
                product.price = parseFloat(editProductPriceInput.value);
                product.weightGrams = parseInt(editProductWeightInput.value) || 0;
                
                if (newQuantity !== oldQuantity) {
                    const diff = newQuantity - oldQuantity;
                    product.quantity = newQuantity;

                    stockHistory.push({
                        id: 'estoque' + Date.now(), type: 'inventario', productName: product.name,
                        productId: product.id, quantity: diff, 
                        timestamp: new Date().toISOString(),
                        details: `Ajuste de inventário por Edição de Produto (Qtd. Anterior: ${oldQuantity}, Nova Qtd.: ${newQuantity})`
                    });
                    saveStockHistory();
                }

                
                saveProducts();
                showToast(`Produto ${product.name} atualizado com sucesso!`, 'success');
                edicaoFormContainer.classList.add('hidden');
                
                // Limpa o estado da busca e o formulário
                if (searchEditProductForm) searchEditProductForm.reset();
                if (gerenciarStatusMessage) gerenciarStatusMessage.textContent = 'Edição salva. Use a busca acima para editar outro produto.';

                // Garante que o estoque seja atualizado visualmente
                renderEstoqueTable(); 
            }
        });
    }

    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', () => {
            edicaoFormContainer.classList.add('hidden');
            if (gerenciarStatusMessage) gerenciarStatusMessage.textContent = 'Edição cancelada. Use a busca acima para encontrar o produto que deseja editar.';
        });
    }

    // --- EXCLUSÃO (EXPOSTA GLOBALMENTE) ---
    window.handleDelete = (id, name, quantity) => {
        if (quantity > 0) {
            showToast(`Não é possível excluir o produto "${name}" pois ainda há ${quantity} unidades em estoque. Zere o estoque primeiro.`, 'error');
            return;
        }

        if (confirm(`Tem certeza que deseja EXCLUIR permanentemente o produto "${name}"?`)) {
            products = products.filter(p => p.id !== id);
            saveProducts();
            
            showToast(`Produto "${name}" excluído com sucesso.`, 'success');
            
            // Re-popula a datalist e esconde o formulário de edição/movimentação
            populateDatalistForEdit();
            populateDatalistForMov();
            edicaoFormContainer.classList.add('hidden');
            if (gerenciarStatusMessage) gerenciarStatusMessage.textContent = 'Produto excluído. Use a busca acima para editar outro produto.';
            renderEstoqueTable();
        }
    };

    // --- MOVIMENTAÇÃO (ENTRADA/SAÍDA - Search-driven) ---
    
    // Função auxiliar para popular produtos no Inventário (mantida)
    const populateInventarioProducts = () => {
        if (!inventarioProdutoSelect) return;
        inventarioProdutoSelect.innerHTML = '<option value="">Selecione o produto</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Estoque Atual: ${product.quantity})`;
            inventarioProdutoSelect.appendChild(option);
        });
    };

    // Popula a datalist de produtos para a Movimentação
    const populateDatalistForMov = () => {
        if (!productListForMov) return;

        productListForMov.innerHTML = '';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = `${product.name} (Qtd: ${product.quantity})`;
            productListForMov.appendChild(option);
        });
    };


    const showMovimentacaoForm = (type) => {
        if (!movimentacaoFormContainer) return;
        
        movType.value = type;
        movTitle.textContent = type === 'entrada' ? 'Registrar Entrada de Estoque' : 'Registrar Saída/Perda';
        
        if (edicaoFormContainer) edicaoFormContainer.classList.add('hidden');
        movimentacaoFormContainer.classList.remove('hidden');
        
        // Reseta o estado
        movSearchContainer.classList.remove('hidden');
        movSearchInput.value = '';
        movProductDetails.classList.add('hidden');
        movProductId.value = '';
        movQuantidade.value = 1;

        populateDatalistForMov();
    };

    if (btnEntrada) btnEntrada.addEventListener('click', () => showMovimentacaoForm('entrada'));
    if (btnSaida) btnSaida.addEventListener('click', () => showMovimentacaoForm('saida'));
    if (movCancelBtn) movCancelBtn.addEventListener('click', () => movimentacaoFormContainer.classList.add('hidden'));
    
    // Função de busca para movimentação (chamada pelo botão "Selecionar")
    if (searchMovProductBtn) {
        searchMovProductBtn.addEventListener('click', () => {
            const searchText = movSearchInput.value.trim();
            if (!searchText) {
                showToast('Digite o nome do produto para buscar.', 'error');
                return;
            }
            
            const productName = searchText.split(' (Qtd:')[0].trim(); 
            const product = products.find(p => p.name.trim() === productName);
            
            if (product) {
                movSearchContainer.classList.add('hidden');
                
                movProductId.value = product.id;
                movProductNameDisplay.textContent = product.name;
                movProductQtyDisplay.textContent = product.quantity;
                
                // Define o max para Saída
                movQuantidade.max = movType.value === 'saida' ? product.quantity : ''; 
                // Zera o campo Qtd. se o produto for novo ou o tipo for Entrada
                movQuantidade.value = 1; 
                
                movProductDetails.classList.remove('hidden');
            } else {
                showToast(`Produto "${productName}" não encontrado.`, 'error');
            }
        });
    }

    if (movimentacaoForm) {
        movimentacaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = movType.value;
            const id = movProductId.value;
            const quantity = parseInt(movQuantidade.value);

            if (!id || quantity <= 0) {
                showToast('O produto não foi selecionado corretamente ou a quantidade é inválida.', 'error');
                return;
            }
            
            const productIndex = products.findIndex(p => p.id === id);
            const product = products[productIndex];

            if (type === 'saida' && quantity > product.quantity) {
                showToast(`Erro: Não é possível dar saída em ${quantity} unidades. Estoque atual: ${product.quantity}.`, 'error');
                return;
            }
            
            const movTimestamp = new Date().toISOString();
            
            if (type === 'entrada') {
                product.quantity += quantity;
            } else { // saida
                product.quantity -= quantity;
            }
            
            stockHistory.push({
                id: 'estoque' + Date.now(), type: type, productName: product.name,
                productId: product.id, quantity: type === 'entrada' ? quantity : -quantity,
                timestamp: movTimestamp, details: `Movimentação manual registrada por: ${currentUser.username}`
            });
            saveStockHistory();


            saveProducts();
            showToast(`${quantity} unidades de ${product.name} registradas como ${type.toUpperCase()}. Novo estoque: ${product.quantity}`, 'success');
            movimentacaoFormContainer.classList.add('hidden');
            renderEstoqueTable(); 
        });
    }
    // --- Fim da Lógica de Movimentação ---

    // --- Lógica de Inventário ---
    if (inventarioForm) {
        inventarioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const productId = document.getElementById('inventarioProduto').value;
            const finalContagem = parseInt(document.getElementById('inventarioContagem').value);
            
            if (!productId || finalContagem === undefined || finalContagem < 0) {
                 showToast('Selecione um produto e informe uma contagem válida.', 'error');
                 return;
            }

            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                 showToast('Produto não encontrado.', 'error');
                 return;
            }

            const product = products[productIndex];
            const oldQuantity = product.quantity;
            const diff = finalContagem - oldQuantity; 

            if (diff === 0) {
                 showToast(`Contagem do produto ${product.name} já está correta.`, 'info');
                 return;
            }

            product.quantity = finalContagem;
            saveProducts();

            stockHistory.push({
                id: 'estoque' + Date.now(), type: 'inventario', productName: product.name,
                productId: product.id, quantity: diff, 
                timestamp: new Date().toISOString(),
                details: `Ajuste de inventário por ${currentUser.username} (Qtd. Anterior: ${oldQuantity}, Nova Qtd.: ${finalContagem})`
            });
            saveStockHistory();
            
            showToast(`Ajuste de inventário de ${product.name} registrado. Diferença: ${diff}.`, 'success');
            inventarioForm.reset();
            populateInventarioProducts(); 
        });
    }

    // --- ADIÇÃO DE PRODUTO ---
    if (addProdutoForm) {
        addProdutoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newId = 'prod' + Date.now();
            
            const newProduct = {
                id: newId,
                name: document.getElementById('newProductName').value,
                quantity: parseInt(document.getElementById('newProductInitialQty').value),
                price: parseFloat(document.getElementById('newProductPrice').value),
                weightGrams: parseInt(document.getElementById('newProductWeight').value) || 0
            };

            products.push(newProduct);
            saveProducts();
            
            if (newProduct.quantity > 0) {
                 stockHistory.push({
                    id: 'estoque' + Date.now() + Math.random(), type: 'entrada', productName: newProduct.name,
                    productId: newId, quantity: newProduct.quantity, timestamp: new Date().toISOString(),
                    details: 'Estoque Inicial no Cadastro do Produto'
                });
                saveStockHistory();
            }

            showToast(`Produto '${newProduct.name}' cadastrado com sucesso!`, 'success');
            addProdutoForm.reset();
            showPage('estoque');
        });
    }

    // --- Lógica de Gerenciamento de Usuários (Mantida a mesma) ---
    function renderUserTable() {
        if (!userTableBody) return;

        userTableBody.innerHTML = '';
        
        const userList = Object.keys(users).map(username => ({ username: username, role: users[username].role }));

        if (userList.length === 0) {
            userTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--text-light);">Nenhum usuário cadastrado.</td></tr>`;
            return;
        }

        userList.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role === 'master' ? 'Master' : 'Comum'}</td>
                <td>
                    <button class="btn small-btn edit-btn" onclick="handleChangePassword('${user.username}')"><i class="fas fa-key"></i> Senha</button>
                    ${user.username !== currentUser.username ? 
                        `<button class="btn small-btn danger-btn" onclick="handleDeleteUser('${user.username}')"><i class="fas fa-trash"></i> Excluir</button>`
                        : ''
                    }
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    window.handleChangePassword = (username) => {
        if (!changePasswordFormContainer) return;

        if (username === currentUser.username) {
            showToast('Por segurança, altere sua própria senha na tela de login/perfil.', 'info');
            return;
        }
        
        changePasswordUsernameSpan.textContent = username;
        changePasswordUserIdInput.value = username;
        newPasswordInput.value = '';
        
        if (edicaoFormContainer) edicaoFormContainer.classList.add('hidden');
        if (movimentacaoFormContainer) movimentacaoFormContainer.classList.add('hidden');
        
        changePasswordFormContainer.classList.remove('hidden');
    };

    window.handleDeleteUser = (username) => {
        if (username === currentUser.username) {
            showToast('Você não pode excluir o seu próprio usuário enquanto estiver logado.', 'error');
            return;
        }

        if (confirm(`Tem certeza que deseja EXCLUIR permanentemente o usuário "${username}"? Esta ação não pode ser desfeita.`)) {
            if (users[username]) {
                delete users[username];
                saveUsers();
                renderUserTable();
                showToast(`Usuário "${username}" excluído com sucesso.`, 'success');
            }
        }
    };

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = changePasswordUserIdInput.value;
            const newPassword = newPasswordInput.value;

            if (users[username] && newPassword.length >= 1) {
                users[username].password = newPassword;
                saveUsers();
                showToast(`Senha do usuário '${username}' alterada com sucesso!`, 'success');
                changePasswordFormContainer.classList.add('hidden');
                newPasswordInput.value = ''; 
            } else {
                showToast('Erro: Usuário não encontrado ou senha inválida.', 'error');
            }
        });
    }

    if (changePasswordCancelBtn) {
        changePasswordCancelBtn.addEventListener('click', () => {
            if (changePasswordFormContainer) {
                changePasswordFormContainer.classList.add('hidden');
            }
        });
    }


    // --- General Event Listeners and Initialization ---

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
    
    const navigate = (e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (!href) return;
        const pageId = href.startsWith('#') ? href.substring(1) : href;
        
        if (pageId === 'logout') {
            logout();
        } else if (pageId && (document.getElementById(pageId + '-page') || pageId === 'login' || pageId === 'cadastro')) {
            showPage(pageId);
        }
    };

    sideMenuItems.forEach(item => item.addEventListener('click', navigate));
    navItems.forEach(item => item.addEventListener('click', navigate));

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login(document.getElementById('loginUsername').value, document.getElementById('loginPassword').value);
        });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            register(document.getElementById('registerUsername').value, document.getElementById('registerPassword').value);
        });
    }
    if (switchToRegister) switchToRegister.addEventListener('click', (e) => { e.preventDefault(); showPage('cadastro'); });
    if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); showPage('login'); });
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    const handleInitialLoad = () => {
        const hash = window.location.hash.substring(1);
        const initialPage = hash || (currentUser ? 'home' : 'login');
        
        if (currentUser) {
            if (initialPage === 'login' || initialPage === 'cadastro') {
                showPage('home');
            } else {
                showPage(initialPage);
            }
        } else {
            if (initialPage === 'cadastro') {
                 showPage('cadastro');
            } else {
                 showPage('login');
            }
        }
    };
    
    window.addEventListener('hashchange', handleInitialLoad);

    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserInfo();
        checkUserPermissions();
    }
    handleInitialLoad(); 
});
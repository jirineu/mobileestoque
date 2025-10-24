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

    // --- Elementos de Vendas (Atualizados) ---
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
    const searchEstoqueBtn = document.getElementById('searchEstoqueBtn');
    const movimentacaoFormContainer = document.getElementById('movimentacaoFormContainer');
    const movimentacaoForm = document.getElementById('movimentacaoForm');
    const movTitle = document.getElementById('movTitle');
    const movType = document.getElementById('movType');
    const movProduto = document.getElementById('movProduto');
    const movQuantidade = document.getElementById('movQuantidade');
    const movCancelBtn = document.getElementById('movCancelBtn');
    const edicaoFormContainer = document.getElementById('edicaoFormContainer');
    const edicaoForm = document.getElementById('edicaoForm');
    const edicaoProductName = document.getElementById('edicaoProductName');
    const editProductId = document.getElementById('editProductId');
    const editProductNameInput = document.getElementById('editProductName');
    const editProductPriceInput = document.getElementById('editProductPrice');
    const editProductWeightInput = document.getElementById('editProductWeight');
    const editCancelBtn = document.getElementById('editCancelBtn');
    
    // --- Elementos de Gerenciamento de Produtos (NOVO) ---
    const gerenciarProdutosTableBody = document.getElementById('gerenciarProdutosTableBody');
    const searchGerenciarInput = document.getElementById('searchGerenciar');
    const searchGerenciarBtn = document.getElementById('searchGerenciarBtn');


    // --- Elementos de Outras Páginas ---
    const addProdutoForm = document.getElementById('addProdutoForm');
    const inventarioProdutoSelect = document.getElementById('inventarioProduto');
    const inventarioForm = document.getElementById('inventarioForm');
    const historicoList = document.getElementById('historicoList'); 

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
        'master': { password: '455596', role: 'master' },
        'comum': { password: '123', role: 'user' }
    };
    const saveUsers = () => localStorage.setItem('users', JSON.stringify(users));

    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 'prod001', name: 'Produto A', quantity: 10, price: 10.00, weightGrams: 100 },
        { id: 'prod002', name: 'Produto B', quantity: 5, price: 25.00, weightGrams: 250 },
        { id: 'prod003', name: 'Produto C', quantity: 20, price: 5.50, weightGrams: 50 }
    ];
    const saveProducts = () => localStorage.setItem('products', JSON.stringify(products));

    // Histórico de Vendas
    let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const saveSalesHistory = () => localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

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
            if (searchGerenciarInput) searchGerenciarInput.value = '';


            switch (pageId) {
                case 'vendas':
                    populateProductsForSale(); 
                    renderCart();
                    break;
                case 'estoque':
                    renderEstoqueTable();
                    break;
                case 'gerenciarProdutos': // NOVO
                    renderGerenciarProdutosTable();
                    break;
                case 'inventario':
                    // Lógica de Inventário
                    break;
                case 'historico': 
                    renderHistoryTable();
                    break;
                case 'gerenciarUsuarios':
                    if (userTableBody) renderUserTable();
                    break;
            }
        }
        
        sideMenu.classList.remove('active');
        updateNavigation(pageId);
    }

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

    // --- Authentication Logic ---

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

    // --- Lógica de Vendas ---

    function populateProductsForSale() {
        if (!produtoAddItemSelect) return;

        produtoAddItemSelect.innerHTML = '<option value="">Selecione o produto</option>';
        products.forEach(product => {
            if (product.quantity > 0) { // Só lista produtos em estoque
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

    // Função global para ser chamada pelo botão "Remover" do carrinho
    window.removeItemFromCart = (index) => {
        currentCart.splice(index, 1);
        populateProductsForSale(); 
        renderCart();
        showToast('Item removido do carrinho.', 'info');
    };
    
    // Listener para adicionar item ao carrinho
    if (addItemForm) {
        addItemForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const productId = produtoAddItemSelect.value;
            const quantity = parseInt(quantidadeAddItemInput.value);

            if (!productId || quantity <= 0) {
                showToast('Selecione um produto e uma quantidade válida.', 'error');
                return;
            }

            const product = products.find(p => p.id === productId);

            if (!product) {
                showToast('Produto não encontrado.', 'error');
                return;
            }

            if (quantity > product.quantity) {
                showToast(`Estoque insuficiente! Disponível: ${product.quantity}`, 'error');
                return;
            }

            const cartItemIndex = currentCart.findIndex(item => item.id === productId);

            if (cartItemIndex > -1) {
                const newQuantity = currentCart[cartItemIndex].quantity + quantity;
                if (newQuantity > product.quantity) {
                     showToast(`Você só pode adicionar mais ${product.quantity - currentCart[cartItemIndex].quantity} unidades.`, 'error');
                     return;
                }
                currentCart[cartItemIndex].quantity = newQuantity;
            } else {
                currentCart.push({
                    id: product.id,
                    name: product.name,
                    quantity: quantity,
                    price: product.price
                });
            }

            // Limpa o formulário e atualiza a UI
            produtoAddItemSelect.value = '';
            quantidadeAddItemInput.value = '1';
            renderCart();
            showToast('Item adicionado ao carrinho.', 'success');
        });
    }

    // Listener para registrar a venda (concluir) - ATUALIZADO
    if (registerSaleBtn) {
        registerSaleBtn.addEventListener('click', () => {
            if (currentCart.length === 0) {
                showToast('O carrinho está vazio.', 'error');
                return;
            }

            const customerName = customerNameInput ? customerNameInput.value.trim() : '';

            // Validação do nome do cliente
            if (!customerName) {
                showToast('O nome do cliente é obrigatório para registrar a venda.', 'error'); 
                return;
            }

            const grandTotal = currentCart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

            // 1. Log Transaction - ATUALIZADO com data real
            const transaction = {
                id: 'venda' + Date.now(),
                type: 'venda',
                customerName: customerName,
                items: currentCart.map(item => ({ 
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.quantity * item.price
                })),
                total: grandTotal,
                timestamp: new Date().toISOString() // Data atual real
            };
            salesHistory.push(transaction);
            saveSalesHistory();

            // 2. Lógica para dar baixa no estoque
            currentCart.forEach(cartItem => {
                const productIndex = products.findIndex(p => p.id === cartItem.id);
                if (productIndex !== -1) {
                    products[productIndex].quantity -= cartItem.quantity;
                }
            });

            saveProducts();
            
            // 3. Clear cart and UI
            currentCart = [];
            
            showToast(`Venda para ${customerName} registrada! Total: R$ ${grandTotal.toFixed(2)}`, 'success');
            
            // Reset customer name field
            if (customerNameInput) customerNameInput.value = '';

            // Atualiza a lista de produtos e o carrinho
            populateProductsForSale();
            renderCart();
            showPage('home');
        });
    }

    // --- Lógica de Histórico ---

    function renderHistoryTable() {
        if (!historicoList) return;
        
        historicoList.innerHTML = '';
        
        if (salesHistory.length === 0) {
            historicoList.innerHTML = `<p style="text-align:center; color: var(--text-light);">Nenhuma transação registrada.</p>`;
            return;
        }

        // Simplesmente lista as transações em ordem decrescente de data
        salesHistory.slice().reverse().forEach(transaction => {
            // Formata a data para a realidade local
            const date = new Date(transaction.timestamp).toLocaleString('pt-BR');
            let itemsText = transaction.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
            
            const listItem = document.createElement('li');
            listItem.className = 'history-list-item card'; 
            listItem.innerHTML = `
                <div class="history-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
                    <span class="type-venda btn small-btn">VENDA</span>
                    <span class="history-date" style="font-size: 0.9em; color: var(--text-light);">${date}</span>
                </div>
                <div class="history-details">
                    <p style="margin-top: 5px;"><strong>Cliente:</strong> ${transaction.customerName}</p>
                    <p><strong>Itens:</strong> ${itemsText}</p>
                    <p><strong>Total:</strong> <span style="color: var(--primary-color); font-weight: bold;">R$ ${transaction.total.toFixed(2)}</span></p>
                </div>
            `;
            historicoList.appendChild(listItem);
        });
    }

    // --- Lógica de Estoque (Visualização Simples com Movimentação) ---
    
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
                <td>
                    <button class="btn small-btn edit-btn" data-id="${product.id}" onclick="handleEdit('${product.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn small-btn danger-btn" data-id="${product.id}" onclick="handleDelete('${product.id}', '${product.name}', ${product.quantity})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            estoqueTableBody.appendChild(row);
        });

        if (estoqueTableBody.children.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align:center; color: var(--text-light);">Nenhum produto encontrado.</td>`;
            estoqueTableBody.appendChild(row);
        }
    }
    
    // --- Lógica de Gerenciamento de Produtos (Listagem Completa) ---
    function renderGerenciarProdutosTable(filterText = '') {
        if (!gerenciarProdutosTableBody) return;
        
        gerenciarProdutosTableBody.innerHTML = '';
        const lowerCaseFilter = filterText.toLowerCase();

        products.filter(product => 
            product.name.toLowerCase().includes(lowerCaseFilter)
        ).forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>R$ ${product.price.toFixed(2)}</td>
                <td>
                    <button class="btn small-btn edit-btn" data-id="${product.id}" onclick="handleEditAll('${product.id}')"><i class="fas fa-edit"></i> Editar Tudo</button>
                    <button class="btn small-btn danger-btn" data-id="${product.id}" onclick="handleDelete('${product.id}', '${product.name}', ${product.quantity})"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            `;
            gerenciarProdutosTableBody.appendChild(row);
        });

        if (gerenciarProdutosTableBody.children.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align:center; color: var(--text-light);">Nenhum produto encontrado.</td>`;
            gerenciarProdutosTableBody.appendChild(row);
        }
    }
    
    // Listeners de Busca (Estoque)
    const filterEstoqueTable = () => {
        if (searchEstoqueInput) {
            renderEstoqueTable(searchEstoqueInput.value);
        }
    };
    if (searchEstoqueInput) {
        searchEstoqueInput.addEventListener('keyup', filterEstoqueTable);
    }
    if (searchEstoqueBtn) {
        searchEstoqueBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            filterEstoqueTable();
        });
    }
    
    // Listeners de Busca (Gerenciar Produtos)
    const filterGerenciarProdutosTable = () => {
        if (searchGerenciarInput) {
            renderGerenciarProdutosTable(searchGerenciarInput.value);
        }
    };
    if (searchGerenciarInput) {
        searchGerenciarInput.addEventListener('keyup', filterGerenciarProdutosTable);
    }
    if (searchGerenciarBtn) {
        searchGerenciarBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            filterGerenciarProdutosTable();
        });
    }

    // --- EDIÇÃO (EXPOSTA GLOBALMENTE) ---
    
    // Novo handler que exibe o formulário de edição com todos os campos, incluindo a Qtd.
    window.handleEditAll = (id) => {
        const product = products.find(p => p.id === id);
        if (!product || !edicaoFormContainer) return;
        
        // Adiciona um campo temporário para edição da quantidade no DOM do formulário de edição
        let qtyField = document.getElementById('editProductQuantityContainer');
        if (!qtyField) {
            qtyField = document.createElement('div');
            qtyField.id = 'editProductQuantityContainer';
            qtyField.innerHTML = `
                <label for="editProductQuantity">Quantidade em Estoque:</label>
                <input type="number" id="editProductQuantity" min="0" required>
            `;
            // Insere o novo campo antes do campo de Preço
            const priceLabel = document.querySelector('#edicaoForm label[for="editProductPrice"]');
            priceLabel.parentNode.insertBefore(qtyField, priceLabel);
        }
        document.getElementById('editProductQuantity').value = product.quantity;


        edicaoProductName.textContent = product.name;
        editProductId.value = product.id;
        editProductNameInput.value = product.name;
        editProductPriceInput.value = product.price.toFixed(2);
        editProductWeightInput.value = product.weightGrams || '';
        
        if (movimentacaoFormContainer) movimentacaoFormContainer.classList.add('hidden');
        edicaoFormContainer.classList.remove('hidden');
    };
    
    // Função existente, mas agora simplificada para abrir o formulário SEM o campo de quantidade (se for chamada do Estoque)
    window.handleEdit = (id) => {
        window.handleEditAll(id); // Usa a função completa
        
        // Remove temporariamente o campo de quantidade para a edição rápida do estoque
        const qtyField = document.getElementById('editProductQuantityContainer');
        if (qtyField) {
            qtyField.classList.add('hidden');
        }
    };


    if (edicaoForm) {
        edicaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = editProductId.value;
            const productIndex = products.findIndex(p => p.id === id);

            if (productIndex !== -1) {
                products[productIndex].name = editProductNameInput.value;
                products[productIndex].price = parseFloat(editProductPriceInput.value);
                products[productIndex].weightGrams = parseInt(editProductWeightInput.value) || 0;
                
                // Verifica e atualiza a quantidade (se o campo estiver visível)
                const qtyInput = document.getElementById('editProductQuantity');
                const qtyContainer = document.getElementById('editProductQuantityContainer');

                if (qtyInput && !qtyContainer.classList.contains('hidden')) {
                     products[productIndex].quantity = parseInt(qtyInput.value);
                }
                
                // Limpa o formulário e re-renderiza
                saveProducts();
                showToast(`Produto ${products[productIndex].name} atualizado com sucesso!`, 'success');
                edicaoFormContainer.classList.add('hidden');
                
                // Verifica qual página está ativa para renderizar a tabela correta
                if (document.getElementById('estoque-page').classList.contains('active')) {
                    renderEstoqueTable();
                } else if (document.getElementById('gerenciarProdutos-page').classList.contains('active')) {
                    renderGerenciarProdutosTable();
                }
            }
        });
    }

    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', () => {
            edicaoFormContainer.classList.add('hidden');
            // Garante que o campo de quantidade, se removido, não apareça na próxima edição de "Estoque"
            const qtyField = document.getElementById('editProductQuantityContainer');
            if (qtyField) {
                 qtyField.classList.remove('hidden'); // Volta ao normal, pois a função handleEditAll lida com o estado.
            }
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
            
            // Verifica qual página está ativa para renderizar a tabela correta
            if (document.getElementById('estoque-page').classList.contains('active')) {
                renderEstoqueTable();
            } else if (document.getElementById('gerenciarProdutos-page').classList.contains('active')) {
                renderGerenciarProdutosTable();
            }
            
            showToast(`Produto "${name}" excluído com sucesso.`, 'success');
        }
    };

    // --- MOVIMENTAÇÃO (ENTRADA/SAÍDA) ---
    const populateMovimentacaoProducts = () => {
        if (!movProduto) return;
        movProduto.innerHTML = '<option value="">Selecione um produto</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Qtd: ${product.quantity})`;
            movProduto.appendChild(option);
        });
    };

    const showMovimentacaoForm = (type) => {
        if (!movimentacaoFormContainer) return;
        movType.value = type;
        movTitle.textContent = type === 'entrada' ? 'Registrar Entrada de Estoque' : 'Registrar Saída/Perda';
        movQuantidade.value = 1;
        populateMovimentacaoProducts();
        
        if (edicaoFormContainer) edicaoFormContainer.classList.add('hidden');
        movimentacaoFormContainer.classList.remove('hidden');
    };

    if (btnEntrada) btnEntrada.addEventListener('click', () => showMovimentacaoForm('entrada'));
    if (btnSaida) btnSaida.addEventListener('click', () => showMovimentacaoForm('saida'));
    if (movCancelBtn) movCancelBtn.addEventListener('click', () => movimentacaoFormContainer.classList.add('hidden'));

    if (movimentacaoForm) {
        movimentacaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = movType.value;
            const id = movProduto.value;
            const quantity = parseInt(movQuantidade.value);

            if (!id || quantity <= 0) {
                showToast('Selecione um produto e uma quantidade válida.', 'error');
                return;
            }
            
            const productIndex = products.findIndex(p => p.id === id);
            const product = products[productIndex];

            if (type === 'saida' && quantity > product.quantity) {
                showToast(`Erro: Não é possível dar saída em ${quantity} unidades. Estoque atual: ${product.quantity}.`, 'error');
                return;
            }

            if (type === 'entrada') {
                product.quantity += quantity;
            } else { // saida
                product.quantity -= quantity;
            }

            saveProducts();
            showToast(`${quantity} unidades de ${product.name} registradas como ${type.toUpperCase()}. Novo estoque: ${product.quantity}`, 'success');
            movimentacaoFormContainer.classList.add('hidden');
            renderEstoqueTable(); 
        });
    }

    // --- ADIÇÃO DE PRODUTO (RESTRITO A PÁGINA #addProduto) ---
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
            showToast(`Produto '${newProduct.name}' cadastrado com sucesso!`, 'success');
            addProdutoForm.reset();
            showPage('estoque');
        });
    }

    // --- Lógica de Gerenciamento de Usuários (Master Only) ---
    
    function renderUserTable() {
        if (!userTableBody) return;

        userTableBody.innerHTML = '';
        
        const userList = Object.keys(users).map(username => ({ 
            username: username, 
            role: users[username].role 
        }));

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

    // UI Listeners
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
    
    // SPA Navigation Listeners
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

    // Authentication Listeners
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

    // Handle initial load and browser back/forward
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

    // Initial load
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserInfo();
        checkUserPermissions();
    }
    handleInitialLoad(); 
});
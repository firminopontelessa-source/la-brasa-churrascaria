(() => {
"use strict";
const cfg = window.LA_BRASA_CONFIG || {};
const STORE = { products:"laBrasa.products.v1", cart:"laBrasa.cart.v1", orders:"laBrasa.orders.v1", reservations:"laBrasa.reservations.v1", settings:"laBrasa.settings.v1" };
const categories = ["Todos","Carnes","Acompanhamentos","Bebidas","Sobremesas"];
const seedProducts = [
{id:"p1",name:"Picanha na brasa",category:"Carnes",description:"Corte macio e suculento, servido no ponto da casa.",price:89.9,image:"https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",available:true,tag:"MAIS PEDIDO"},
{id:"p2",name:"Costela fogo lento",category:"Carnes",description:"Costela assada lentamente, sabor intenso e textura macia.",price:76.9,image:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",available:true,tag:"ESPECIAL"},
{id:"p3",name:"Ancho premium",category:"Carnes",description:"Marmoreio equilibrado e sabor marcante da grelha.",price:82.9,image:"https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p4",name:"Linguiça artesanal",category:"Carnes",description:"Linguiça artesanal dourada na brasa.",price:34.9,image:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p5",name:"Farofa da casa",category:"Acompanhamentos",description:"Farofa crocante com manteiga e tempero especial.",price:12.9,image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p6",name:"Vinagrete fresco",category:"Acompanhamentos",description:"Tomate, cebola, cheiro-verde e toque cítrico.",price:9.9,image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p7",name:"Pão de alho",category:"Acompanhamentos",description:"Pão tostado na brasa com creme de alho.",price:14.9,image:"https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p8",name:"Refrigerante lata",category:"Bebidas",description:"Lata 350 ml. Consulte os sabores disponíveis.",price:7.0,image:"https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p9",name:"Suco natural",category:"Bebidas",description:"Suco preparado na hora. Consulte os sabores.",price:10.9,image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p10",name:"Pudim da casa",category:"Sobremesas",description:"Pudim cremoso com calda de caramelo.",price:13.9,image:"https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",available:true,tag:""},
{id:"p11",name:"Brownie com sorvete",category:"Sobremesas",description:"Brownie de chocolate servido com sorvete.",price:19.9,image:"https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=900&q=80",available:true,tag:""}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat("pt-BR",{style:"currency",currency:cfg.currency||"BRL"}).format(Number(n)||0);
const read = (key,fallback) => { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch(e){ console.warn("Falha ao ler armazenamento",e); return fallback; } };
const write = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch(e){ toast("Não foi possível salvar. Verifique o espaço disponível no navegador."); return false; } };
let products=read(STORE.products,seedProducts), cart=read(STORE.cart,[]), activeCategory="Todos", adminTab="products", toastTimer;
const settings=read(STORE.settings,cfg.restaurant||{});
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3000);}
function safeText(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function saveProducts(){write(STORE.products,products);}
function renderCategories(){ $("#categoryTabs").innerHTML=categories.map(c=>`<button role="tab" aria-selected="${activeCategory===c}" class="${activeCategory===c?"active":""}" data-category="${c}">${c}</button>`).join("");}
function renderMenu(){
 const q=$("#menuSearch").value.trim().toLocaleLowerCase("pt-BR");
 const shown=products.filter(p=>(activeCategory==="Todos"||p.category===activeCategory)&&(!q||(p.name+" "+p.description+" "+p.category).toLocaleLowerCase("pt-BR").includes(q)));
 $("#menuGrid").innerHTML=shown.length?shown.map(p=>`<article class="product-card"><div class="product-image"><img loading="lazy" src="${safeText(p.image)}" alt="${safeText(p.name)}" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=70'">${p.tag?`<span class="product-tag">${safeText(p.tag)}</span>`:""}</div><div class="product-body"><h3>${safeText(p.name)}</h3><p>${safeText(p.description)}</p><div class="product-foot"><span class="price">${money(p.price)}</span>${p.available?`<button class="add-btn" data-add="${p.id}">Adicionar +</button>`:`<span class="unavailable">Indisponível</span>`}</div></div></article>`).join(""):`<div class="empty-state">Nenhum item encontrado nesta categoria.</div>`;
}
function cartDetails(){return cart.map(i=>({...i,product:products.find(p=>p.id===i.id)})).filter(i=>i.product);}
function cartTotal(){return cartDetails().reduce((sum,i)=>sum+i.qty*Number(i.product.price),0);}
function renderCart(){
 const rows=cartDetails();$("#cartCount").textContent=rows.reduce((s,i)=>s+i.qty,0);$("#cartTotal").textContent=money(cartTotal());
 $("#cartItems").innerHTML=rows.length?rows.map(i=>`<div class="cart-row"><div><h4>${safeText(i.product.name)}</h4><small>${money(i.product.price)} cada · ${money(i.product.price*i.qty)}</small><div class="qty-control"><button data-qty="${i.id}" data-delta="-1" aria-label="Diminuir">−</button><b>${i.qty}</b><button data-qty="${i.id}" data-delta="1" aria-label="Aumentar">+</button><button class="remove-item" data-remove="${i.id}">Remover</button></div></div></div>`).join(""):`<div class="empty-state">Sua sacola está vazia.<br>Escolha seus favoritos no cardápio.</div>`;
 write(STORE.cart,cart);
}
function openCart(){ $("#cartDrawer").classList.add("open");$("#drawerBackdrop").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");}
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#drawerBackdrop").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||!p.available)return;const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});renderCart();toast(`${p.name} adicionado à sacola.`);}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<1)cart=cart.filter(x=>x.id!==id);renderCart();}
function phoneDigits(v){return String(v||"").replace(/\D/g,"");}
function sendWhatsApp(text){const phone=phoneDigits(settings.phone||cfg.restaurant?.phone);if(phone.length<12){toast("Configure um WhatsApp válido nas informações da churrascaria.");return;}window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,"_blank","noopener");}
function checkout(){
 const rows=cartDetails();if(!rows.length){toast("Adicione pelo menos um produto ao pedido.");return;}
 const notes=$("#orderNotes").value.trim(), id="PED-"+Date.now().toString().slice(-8);
 const order={id,items:rows.map(i=>({id:i.id,name:i.product.name,price:Number(i.product.price),qty:i.qty})),total:cartTotal(),notes,status:"Recebido",createdAt:new Date().toISOString()};
 const orders=read(STORE.orders,[]);orders.unshift(order);if(!write(STORE.orders,orders))return;
 const lines=rows.map(i=>`• ${i.qty}x ${i.product.name} — ${money(i.product.price*i.qty)}`).join("\n");
 const msg=`Olá! Gostaria de fazer um pedido na La-Brasa.\nPedido: ${id}\n\n${lines}\n\nTotal: ${money(order.total)}${notes?`\nObservações: ${notes}`:""}\n\nAguardo a confirmação.`;
 sendWhatsApp(msg);cart=[];$("#orderNotes").value="";renderCart();closeCart();toast("Pedido registrado neste navegador e enviado para o WhatsApp.");
}
function populateReservationOptions(){
 const date=$("#resDate");date.min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
 const times=[];for(let h=11;h<=22;h++){times.push(`${String(h).padStart(2,"0")}:00`);if(h<22)times.push(`${String(h).padStart(2,"0")}:30`);}
 $("#resTime").innerHTML='<option value="">Selecione</option>'+times.map(t=>`<option>${t}</option>`).join("");
 $("#resGuests").innerHTML='<option value="">Selecione</option>'+Array.from({length:20},(_,i)=>`<option value="${i+1}">${i+1} ${i?"pessoas":"pessoa"}</option>`).join("")+'<option value="21">Mais de 20 pessoas</option>';
}
function reservationSubmit(e){
 e.preventDefault();const f=new FormData(e.currentTarget),data=Object.fromEntries(f.entries());
 if(data.date<$("#resDate").min){toast("Escolha uma data válida.");return;}
 const id="RES-"+Date.now().toString().slice(-8),record={id,...data,status:"Solicitada",createdAt:new Date().toISOString()};
 const all=read(STORE.reservations,[]);all.unshift(record);if(!write(STORE.reservations,all))return;
 const msg=`Olá! Gostaria de solicitar uma reserva na La-Brasa.\nCódigo: ${id}\nNome: ${data.name}\nTelefone: ${data.phone}\nData: ${data.date}\nHorário: ${data.time}\nPessoas: ${data.guests}\nObservações: ${data.notes||"Nenhuma"}\n\nAguardo a confirmação da equipe.`;
 $("#reservationFeedback").textContent=`Solicitação ${id} registrada neste navegador. Abrindo o WhatsApp para enviar à equipe.`;
 sendWhatsApp(msg);e.currentTarget.reset();toast("Solicitação registrada. A equipe precisa confirmar a disponibilidade.");
}
function setRestaurantInfo(){
 $("#addressText").textContent=settings.address||"Endereço a informar";$("#hoursText").textContent=settings.hours||"Consulte nossos horários";$("#phoneText").textContent=settings.displayPhone||settings.phone||"Telefone a informar";$("#mapsLink").href=settings.mapsUrl||"#";
}
function adminOpen(){ $("#adminBackdrop").classList.add("open");document.body.style.overflow="hidden"; }
function adminClose(){ $("#adminBackdrop").classList.remove("open");document.body.style.overflow=""; }
function adminLogged(){ $("#adminLogin").hidden=true;$("#adminApp").hidden=false;renderAdmin(); }
function adminLogout(){sessionStorage.removeItem("laBrasaAdmin");$("#adminApp").hidden=true;$("#adminLogin").hidden=false;$("#adminPassword").value="";}
function renderAdmin(){
 $$("#adminTabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===adminTab));
 const host=$("#adminContent");host.className="admin-content";
 if(adminTab==="products"){
 host.innerHTML=`<h3>Produtos do cardápio</h3><p>Adicione, edite e controle a disponibilidade dos itens exibidos no site.</p>
 <form id="productForm" class="admin-form">
 <label>Nome<input name="name" required maxlength="70"></label><label>Categoria<select name="category">${categories.slice(1).map(c=>`<option>${c}</option>`).join("")}</select></label>
 <label>Preço (R$)<input name="price" type="number" min="0.01" step=".01" required></label><label>Imagem (URL)<input name="image" type="url" placeholder="https://..." required></label>
 <label class="wide">Descrição<textarea name="description" maxlength="220" required></textarea></label><label>Etiqueta<input name="tag" maxlength="25"></label><label>Disponibilidade<select name="available"><option value="true">Disponível</option><option value="false">Indisponível</option></select></label><button class="btn btn-gold">Adicionar produto</button></form>
 <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>${products.map(p=>`<tr><td>${safeText(p.name)}</td><td>${safeText(p.category)}</td><td>${money(p.price)}</td><td><span class="pill ${p.available?"":"off"}">${p.available?"Disponível":"Indisponível"}</span></td><td><button data-product-toggle="${p.id}">${p.available?"Pausar":"Ativar"}</button><button data-product-edit="${p.id}">Editar</button><button data-product-delete="${p.id}">Excluir</button></td></tr>`).join("")}</tbody></table></div>`;
 $("#productForm").addEventListener("submit",productAdd);
 } else if(adminTab==="orders"){
 const orders=read(STORE.orders,[]);
 host.innerHTML=`<h3>Pedidos registrados</h3><p>Pedidos enviados pelo site ficam registrados neste navegador.</p>${orders.length?`<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Código / Data</th><th>Itens</th><th>Total</th><th>Status</th></tr></thead><tbody>${orders.map(o=>`<tr><td>${safeText(o.id)}<br><small>${new Date(o.createdAt).toLocaleString("pt-BR")}</small></td><td>${o.items.map(i=>`${i.qty}x ${safeText(i.name)}`).join("<br>")}</td><td>${money(o.total)}</td><td><select class="status-select" data-order-status="${o.id}">${["Recebido","Em preparo","Pronto","Concluído","Cancelado"].map(s=>`<option ${o.status===s?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div>`:`<div class="notice">Nenhum pedido registrado neste navegador.</div>`}`;
 } else if(adminTab==="reservations"){
 const reservations=read(STORE.reservations,[]);
 host.innerHTML=`<h3>Solicitações de reserva</h3><p>Atualize o andamento das solicitações recebidas.</p>${reservations.length?`<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Código / Cliente</th><th>Data e horário</th><th>Pessoas</th><th>Contato</th><th>Status</th></tr></thead><tbody>${reservations.map(r=>`<tr><td>${safeText(r.id)}<br>${safeText(r.name)}</td><td>${safeText(r.date)} · ${safeText(r.time)}</td><td>${safeText(r.guests)}</td><td>${safeText(r.phone)}</td><td><select class="status-select" data-res-status="${r.id}">${["Solicitada","Confirmada","Recusada","Concluída"].map(s=>`<option ${r.status===s?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div>`:`<div class="notice">Nenhuma reserva registrada neste navegador.</div>`}`;
 } else {
 host.innerHTML=`<h3>Informações da churrascaria</h3><p>Estes dados aparecem no rodapé e são usados para montar as mensagens do WhatsApp.</p><form id="settingsForm" class="admin-form">
 <label>Nome da churrascaria<input name="name" value="${safeText(settings.name||"La-Brasa Churrascaria")}" required></label><label>WhatsApp (código país + DDD + número)<input name="phone" value="${safeText(settings.phone||"")}" required placeholder="5527999999999"></label>
 <label>Telefone exibido<input name="displayPhone" value="${safeText(settings.displayPhone||"")}"></label><label>Horários de funcionamento<input name="hours" value="${safeText(settings.hours||"")}"></label>
 <label class="wide">Endereço<input name="address" value="${safeText(settings.address||"")}"></label><label class="wide">Link do Google Maps<input name="mapsUrl" type="url" value="${safeText(settings.mapsUrl||"")}"></label><button class="btn btn-gold">Salvar informações</button></form>
 <div class="notice"><b>Persistência atual:</b> dados salvos apenas neste navegador (localStorage). Para sincronizar com vários dispositivos e usuários, conecte Supabase e configure autenticação + políticas RLS. O painel local não é seguro para operação comercial multiusuário.</div>`;
 $("#settingsForm").addEventListener("submit",settingsSave);
 }
}
function productAdd(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));const price=Number(d.price);if(!Number.isFinite(price)||price<=0){toast("Informe um preço válido.");return;}products.push({id:"p"+Date.now(),...d,price,available:d.available==="true"});saveProducts();renderAdmin();renderMenu();toast("Produto adicionado.");}
function productEdit(id){const p=products.find(x=>x.id===id);if(!p)return;const name=prompt("Nome do produto:",p.name);if(name===null)return;const price=prompt("Preço em reais:",p.price);if(price===null)return;if(!name.trim()||!Number.isFinite(Number(price))||Number(price)<=0){toast("Nome ou preço inválido.");return;}p.name=name.trim();p.price=Number(price);const category=prompt("Categoria (Carnes, Acompanhamentos, Bebidas ou Sobremesas):",p.category);if(category!==null){if(!["Carnes","Acompanhamentos","Bebidas","Sobremesas"].includes(category.trim())){toast("Categoria inválida.");return;}p.category=category.trim();}const desc=prompt("Descrição:",p.description);if(desc!==null)p.description=desc;const image=prompt("URL da imagem:",p.image);if(image!==null)p.image=image;const tag=prompt("Etiqueta (opcional):",p.tag||"");if(tag!==null)p.tag=tag;saveProducts();renderAdmin();renderMenu();toast("Produto atualizado.");}
function settingsSave(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));if(phoneDigits(d.phone).length<12){toast("Informe o WhatsApp com código do país, DDD e número.");return;}Object.assign(settings,d);write(STORE.settings,settings);setRestaurantInfo();renderAdmin();toast("Informações salvas.");}
function events(){
 $("#categoryTabs").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;renderCategories();renderMenu();});
 $("#menuSearch").addEventListener("input",renderMenu);
 $("#menuGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add);});
 $("#cartOpen").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closeCart);$("#drawerBackdrop").addEventListener("click",closeCart);$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q)changeQty(q.dataset.qty,Number(q.dataset.delta));if(r){cart=cart.filter(i=>i.id!==r.dataset.remove);renderCart();}});
 $("#checkoutBtn").addEventListener("click",checkout);$("#reservationForm").addEventListener("submit",reservationSubmit);
 $("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
 $$("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
 $("#adminEntry").addEventListener("click",adminOpen);$("#adminClose").addEventListener("click",adminClose);$("#adminBackdrop").addEventListener("click",e=>{if(e.target===$("#adminBackdrop"))adminClose();});
 $("#loginForm").addEventListener("submit",e=>{e.preventDefault();if($("#adminPassword").value===(cfg.localAdminPassword||"brasa123")){sessionStorage.setItem("laBrasaAdmin","1");adminLogged();}else toast("Senha incorreta.");});
 $("#adminLogout").addEventListener("click",adminLogout);$("#adminTabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){adminTab=b.dataset.tab;renderAdmin();}});
 $("#adminContent").addEventListener("submit",()=>{});
 $("#adminContent").addEventListener("click",e=>{
 const t=e.target.closest("[data-product-toggle]"),d=e.target.closest("[data-product-delete]"),ed=e.target.closest("[data-product-edit]");
 if(t){const p=products.find(x=>x.id===t.dataset.productToggle);if(p){p.available=!p.available;saveProducts();renderAdmin();renderMenu();}}
 if(d&&confirm("Excluir este produto do cardápio?")){products=products.filter(x=>x.id!==d.dataset.productDelete);cart=cart.filter(x=>x.id!==d.dataset.productDelete);saveProducts();renderAdmin();renderMenu();renderCart();}
 if(ed)productEdit(ed.dataset.productEdit);
 });
 $("#adminContent").addEventListener("change",e=>{
 const os=e.target.closest("[data-order-status]");if(os){const arr=read(STORE.orders,[]),o=arr.find(x=>x.id===os.dataset.orderStatus);if(o){o.status=os.value;write(STORE.orders,arr);toast("Status do pedido atualizado.");}}
 const rs=e.target.closest("[data-res-status]");if(rs){const arr=read(STORE.reservations,[]),r=arr.find(x=>x.id===rs.dataset.resStatus);if(r){r.status=rs.value;write(STORE.reservations,arr);toast("Status da reserva atualizado.");}}
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();adminClose();}});
}
function init(){
 renderCategories();renderMenu();renderCart();populateReservationOptions();setRestaurantInfo();events();
 $("#year").textContent=new Date().getFullYear();
 if(sessionStorage.getItem("laBrasaAdmin")==="1")adminLogged();
}
init();
})();
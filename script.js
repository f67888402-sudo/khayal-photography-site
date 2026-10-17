const prices = {
  khayal: [
    {name:'جلسة تخرّج', detail:'جلسة فردية • صور معدّلة', price:'250', unit:'₪'},
    {name:'جلسة مناسبة', detail:'عيد ميلاد أو جلسة خارجية', price:'350', unit:'₪'},
    {name:'برومو مشروع تخرّج', detail:'تصوير فيديو وصور للمشروع', price:'500', unit:'₪'},
    {name:'تغطية عرس', detail:'زفّة أو غداء العرس • حسب الساعات', price:'800', unit:'₪'},
    {name:'افتتاح محل', detail:'صور وفيديو قصير للمكان', price:'400', unit:'₪'},
    {name:'جلسة عروس', detail:'جلسة خارجية • تنسيق مسبق', price:'600', unit:'₪'}
  ],
  khayali: [
    {name:'باقة منتج واحد', detail:'صور بتنسيق بسيط وخلفية مناسبة', price:'150', unit:'₪'},
    {name:'باقة 5 منتجات', detail:'تصوير وتعديل أساسي للصور', price:'400', unit:'₪'},
    {name:'محتوى متجر', detail:'10 منتجات • صور للسوشال ميديا', price:'700', unit:'₪'}
  ]
};
const services = {
  khayal: ['جلسة تخرّج','جلسة عروس أو خطوبة','زفّة أو غداء عرس','عيد ميلاد أو جلسة خارجية','برومو مشروع تخرّج','افتتاح محل','تصوير خريجين أو برومو شباب'],
  khayali: ['تصوير منتج واحد','باقة 5 منتجات','محتوى متجر / 10 منتجات','طلب خاص']
};
const priceList = document.querySelector('#price-list');
const tabs = [...document.querySelectorAll('.price-tab')];
function renderPrices(brand='khayal') {
  priceList.innerHTML = prices[brand].map(item => `<article class="price-card" data-brand="${brand}"><h3>${item.name}</h3><p>${item.detail}</p><strong>${item.price} <small>${item.unit}</small></strong><button class="price-choose" data-service="${item.name}" data-brand="${brand}">اختاري الباقة ↙</button></article>`).join('');
  tabs.forEach(tab => { const active = tab.dataset.price === brand; tab.classList.toggle('active',active); tab.setAttribute('aria-selected',String(active)); });
}
renderPrices();
priceList.addEventListener('click', event => {
  const button=event.target.closest('.price-choose'); if(!button) return;
  setBrand(button.dataset.brand,button.dataset.service);
  document.querySelector('#booking').scrollIntoView({behavior:'smooth'});
});
tabs.forEach(tab=>tab.addEventListener('click',()=>renderPrices(tab.dataset.price)));
const brandSelect=document.querySelector('#brand-select');
const serviceSelect=document.querySelector('#service-select');
function setBrand(brand, service='') {
  brandSelect.value=brand;
  serviceSelect.disabled=false;
  serviceSelect.innerHTML='<option value="">اختاري نوع الجلسة</option>'+services[brand].map(item=>`<option>${item}</option>`).join('');
  if(service) {
    const matching=[...serviceSelect.options].find(option=>option.text.includes(service)||service.includes(option.text));
    if(matching) serviceSelect.value=matching.value;
  }
}
brandSelect.addEventListener('change',()=>{
  if(!brandSelect.value){serviceSelect.disabled=true;serviceSelect.innerHTML='<option value="">اختاري القسم أولًا</option>';return;}
  setBrand(brandSelect.value);
});
document.querySelectorAll('[data-pick]').forEach(link=>link.addEventListener('click',()=>setBrand(link.dataset.pick)));
const dateInput=document.querySelector('#date-select');
const today=new Date();
const localToday=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
dateInput.min=localToday;
const form=document.querySelector('#booking-form');
const success=document.querySelector('#form-success');
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  const brandLabel=data.get('brand')==='khayali'?'خيالي للمنتجات':'استوديو خيال';
  const request={
    ref:'KH-'+Math.random().toString(36).slice(2,7).toUpperCase(),
    brand:brandLabel, service:data.get('service'), name:data.get('name'), phone:data.get('phone'), date:data.get('date'), time:data.get('time'), notes:data.get('notes')||'—', createdAt:new Date().toISOString()
  };
  try { const saved=JSON.parse(localStorage.getItem('khayal-demo-bookings')||'[]'); saved.push(request); localStorage.setItem('khayal-demo-bookings',JSON.stringify(saved)); } catch(e) {}
  success.hidden=false;
  success.textContent=`وصلنا طلبك التجريبي يا ${request.name} ✨\nرقم الطلب: ${request.ref}\n${request.brand} — ${request.service}\nالتاريخ المقترح: ${request.date} (${request.time})\nتذكير: هذا نموذج عرض للمشروع، والطلب محفوظ على هذا الجهاز فقط. لتأكيد حقيقي، لازم ربط الموقع بواتساب أو خدمة استقبال طلبات.`;
  success.scrollIntoView({behavior:'smooth',block:'nearest'});
});
const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
nav.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}});

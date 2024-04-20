const logout_form = document.querySelector('#logout_form');
if(logout_form){
  const logout_btn = document.querySelector('#logout_btn');
  logout_btn.addEventListener('click', (e)=>{
    logout_form.submit();
  })
}
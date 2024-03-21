// let sidebar = document.getElementsByClassName("sidebar")[0];
// let sidebar_content = document.getElementsByClassName("content-wrapper")[0];
// window.onscroll = () => {
//     let scrollTop = window.scrollY; // current scroll position
//     let viewportHeight = window.innerHeight; //viewport height
//     let contentHeight = sidebar_content.getBoundingClientRect().height; // current content height
//     let sidebarTop = sidebar.getBoundingClientRect().top + window.scrollY; //distance from top to sidebar
//     console.log(contentHeight);
//     if (scrollTop >= contentHeight - viewportHeight + sidebarTop) {
//         sidebar_content.style.transform = `translateY(-${contentHeight - viewportHeight + sidebarTop}px)`;
//         sidebar_content.style.position = "fixed";
        
//     }
//     else {
//         sidebar_content.style.transform = "";
//         sidebar_content.style.position = "";
//     }
// }
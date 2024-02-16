

document.addEventListener('DOMContentLoaded', function () {
    const updateBtns = document.querySelectorAll('btn');
    const modal = document.getElementById('updateModal');
    const closeBtn = document.getElementById('closeBtn');

    updateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log("hi");
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        console.log("2");
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            console.log(event.target);
            modal.style.display = 'none';
        }
    });
});
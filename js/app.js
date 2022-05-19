window.addEventListener('DOMContentLoaded', () => {
    const { createApp } = Vue;
    let url = 'https://reqres.in/api/users?page=1';
    
    const app = createApp({
        data() {
            return {
                users:[],
                user: { 
                    id: '', 
                    email:'', 
                    first_name: '', 
                    last_name: '', 
                    birthday: '' 
                } 
            }
        },
        created() {
            const lsUsers = localStorage.getItem('lsUsers');

            if(lsUsers){
                this.users = JSON.parse(lsUsers);
            } else {
                this.listUsers();
            }
        },
        mounted(){
            this.$refs.emailRef.focus();
        },
        methods: {
            listUsers: async function() {
                const res = await fetch(url);
                const { data } = await res.json();
                this.users = data;
                this.updateLocalStorage();
            },
            updateLocalStorage: function() {
                localStorage.setItem('lsUsers', JSON.stringify(this.users));
            },
            ageCalculate: function(birthday){
                let age = '-';

                if(birthday){
                    let today = new Date();
                    let birthDate = new Date(birthday);
                    age = today.getFullYear() - birthDate.getFullYear();
                    let m = today.getMonth() - birthDate.getMonth();

                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }
                return age;
            },
            createUser: function(e) {
                e.preventDefault();
                if(this.validateForm()){
                    let lastUser = this.users[this.users.length - 1];
                    this.user.id = lastUser.id + 1;
                    this.users.push({
                        id: this.user.id,
                        email: this.user.email,
                        first_name: this.user.first_name,
                        last_name: this.user.last_name,
                        birthday: this.user.birthday
                    });
                    this.updateLocalStorage();
                    this.clearField();
                    this.showAlert('Usuario agregado exitosamente!!'); 
                }
            },
            validateForm: function() {
                const {email, first_name, last_name, birthday} = this.user;

                if(email !== '' ){
                    if(this.validateEmail(email) === false){
                        this.showAlert('Introduzca un email correcto');
                        return false;
                    }
                }else {
                    this.showAlert('Email es requerido');
                    return false;
                }
                
                if(first_name.length === 0){
                    this.showAlert('Nombre es requerido');
                    return false;
                }

                if(last_name.length === 0){
                    this.showAlert('Apellido es requerido');
                    return false;
                }

                if(birthday.length === 0){
                    this.showAlert('Fecha de nacimiento es requerido');
                    return false;
                }

                return true;
            },
            showAlert: function(message) {
                Swal.fire(message);
            },
            validateEmail: function (email) {
                const re = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
                return re.test(email.toLowerCase());
            },
            clearField: function() {
                this.user.id="",
                this.user.email="",
                this.user.first_name="",
                this.user.last_name="",
                this.user.birthday=""
            },
            reset: function() {
                this.$refs.userForm.reset();
            }
        }   
    })

    app.mount('#app');
});

// function init(){}
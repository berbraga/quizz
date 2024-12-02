<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card class="pa-10" elevation="3" style="width: 700px; max-width: 90%; min-height: 500px;">

      <v-form ref="form" v-model="isFormValid">
        <v-row align="center" justify="center">
          <v-img src="/capelo.png" max-height="100" max-width="100" class="mr-3" alt="Capelo"></v-img>
          <h1 class="text-blue mb-0" style="font-size: 36px;">Study Quiz</h1>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row class="mb-5" justify="center" align="center">
          <v-col cols="auto">
            <v-img src="/email.png" alt="email" style="width: 70px; height: 70px;" class="mr-3"></v-img>
          </v-col>
          <v-col>
            <v-text-field 
              v-model="formData.email"
              label="Email" 
              outlined
              clearable
              :rules="[rules.required, rules.email]"
              class="w-100"
              :style="{ backgroundColor: '#1E3A8A', color: 'white' }"></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mb-5" justify="center" align="center">
          <v-col cols="auto">
            <v-img src="/login.png" alt="Login" style="width: 70px; height: 70px;" class="mr-3"></v-img>
          </v-col>
          <v-col>
            <v-text-field label="Login" 
            v-model="formData.name"
            outlined
            clearable
            :rules="[rules.required]"
            class="w-100"
            :style="{ backgroundColor: '#1E3A8A', color: 'white' }"></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mb-6" justify="center" align="center">
          <v-col cols="auto">
            <v-img src="/lock.png" alt="Cadeado" style="width: 70px; height: 70px;" class="mr-3"></v-img>
          </v-col>
          <v-col>
            <v-text-field type="password" label="Senha" outlined dense class="w-100" :rules="[rules.required, rules.password]" v-model="formData.password"
              :style="{ backgroundColor: '#1E3A8A', color: 'white' }"></v-text-field>
          </v-col>
        </v-row>

        <v-row class="mb-6" justify="center" align="center">
          <v-col cols="auto">
            <v-img src="/lock.png" alt="Cadeado" style="width: 70px; height: 70px;" class="mr-3"></v-img>
          </v-col>
          <v-col>
            <v-text-field type="password" label="Confirmar Senha" v-model="formData.confirmPassword" outlined clearable :rules="[rules.required, confirmPasswordRule]" class="w-100"
              :style="{ backgroundColor: '#1E3A8A', color: 'white' }"></v-text-field>
          </v-col>

        </v-row>

        <v-row class="d-flex align-center justify-center">
          <v-checkbox
            label="Sou aluno"
            v-model="formData.isStudent"
          ></v-checkbox>
        </v-row>  

        <v-row class="d-flex align-center justify-center">
          <v-btn
            style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px;"
            block
            :disabled="!isFormValid"
            @click="handleRegister"
          >
            Cadastrar
          </v-btn>
            <v-btn
          style="background-color: cornflowerblue; color: white; width: 48%; font-size: 18px; padding: 12px; height: 50px; margin-top: 15px;"
          block
          @click="goBack"
        >
          Voltar
          </v-btn>
        </v-row>
      </v-form>
    </v-card>


  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { addData, doesFieldValueExist } from "@/services/firebase";

const router = useRouter();

const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isStudent: false,
});

const isFormValid = ref(false);

const rules = {
  required: (value) => !!value || "Campo obrigatório",
  email: (value) => /\S+@\S+\.\S+/.test(value) || "E-mail inválido",
  password: (value) =>
    value.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
};

// Regra para confirmar a senha
const confirmPasswordRule = (value) =>
  value === formData.password || "As senhas não coincidem";

// Lida com o cadastro
const handleRegister = async () => {
  if (formData.name && formData.email && formData.password === formData.confirmPassword) {
    try {
      const emailExists = await doesFieldValueExist("users", "email", formData.email);

      if (emailExists) {
        alert("Este e-mail já está cadastrado. Tente outro.");
      } else {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password, // Para produção, lembre-se de criptografar!
          isStudent: formData.isStudent,
          createdAt: new Date().toISOString(),
        };

        // Adiciona os dados no Firestore
        await addData("users", null, userData);
        alert("Cadastro realizado com sucesso!");
        router.push("/"); // Redireciona para a rota "/"
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Ocorreu um erro ao realizar o cadastro. Tente novamente.");
    }
  } else {
    alert("Por favor, preencha todos os campos corretamente.");
  }
};

// Lida com o botão "Voltar"
const goBack = () => {
  router.back(); // Volta para a página anterior
};
</script>

<style scoped>
/* Estilo adicional, se necessário */
</style>

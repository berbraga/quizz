<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card elevation="4" class="pa-6" max-width="400">
      <v-card-title class="text-h5 justify-center">
        Esqueceu a Senha
      </v-card-title>
      <v-card-text>
        <v-form>
          <!-- Campo de Email -->
          <v-text-field
            label="Email"
            v-model="formData.email"
            outlined
            clearable
            :rules="[rules.required, rules.email]"
          ></v-text-field>

          <!-- Campo de Nova Senha -->
          <v-text-field
            label="Nova Senha"
            v-model="formData.newPassword"
            type="password"
            outlined
            clearable
            :rules="[rules.required, rules.password]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex flex-column">
        <!-- Botão para Atualizar Senha -->
        <v-btn
          color="primary"
          class="mb-3"
          block
          @click="handlePasswordReset"
        >
          Alterar Senha
        </v-btn>

        <!-- Botão para Voltar -->
        <v-btn
          color="secondary"
          block
          @click="goBack"
        >
          Voltar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { getData, doesFieldValueExist, addData } from "@/services/firebase"; // Importa funções do Firestore

const router = useRouter();

const formData = reactive({
  email: "",
  newPassword: "",
});

const rules = {
  required: (value) => !!value || "Campo obrigatório",
  email: (value) => /\S+@\S+\.\S+/.test(value) || "E-mail inválido",
  password: (value) =>
    value.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
};

// Função para resetar a senha
const handlePasswordReset = async () => {
  if (formData.email && formData.newPassword) {
    try {
      // Verifica se o email existe no Firestore
      const emailExists = await doesFieldValueExist("users", "email", formData.email);

      if (emailExists) {
        // Busca os dados do usuário para atualizar a senha
        const users = await getData("users");
        const user = users.find((user) => user.email === formData.email);

        if (user) {
          // Atualiza a senha do usuário
          await addData("users", user.id, {
            ...user,
            password: formData.newPassword, // Substitui pela nova senha
          });

          alert("Senha alterada com sucesso!");
          router.push("/"); // Redireciona para a página inicial
        } else {
          alert("Erro ao buscar os dados do usuário.");
        }
      } else {
        alert("Email não encontrado no sistema.");
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Erro ao alterar senha. Tente novamente.");
    }
  } else {
    alert("Por favor, preencha todos os campos corretamente.");
  }
};

// Redireciona para a página anterior
const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* Estilo adicional, se necessário */
</style>

<template>
  <div class="modal" :class="{ 'is-active': modalAberta }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="box">
        <slot></slot>
        <button
          class="modal-close"
          aria-label="close"
          @click="closeModal"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop()
  modalAberta = false;

  openModal() {
    this.modalAberta = true;
  }

  closeModal() {
    this.modalAberta = false;
  }
}
</script>

<style>
.modal {
  display: none;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.modal.is-active {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  max-width: 80%;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
}
</style>

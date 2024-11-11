<template>
    <el-dialog v-model="resultVisible">
        {{ result }}
    </el-dialog>
    <el-dialog v-model="registerVisible">
        <el-row justify="center">
            <el-form :model="registerForm" label-width="120px">
                <el-form-item label="用户名">
                    <el-input v-model="registerForm.username" />
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input v-model="registerForm.email" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="registerForm.password" type="password" />
                </el-form-item>

                <el-row>
                    <el-col :span="3">
                        <el-form-item>
                            <el-button type="primary" @click="register">注册</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </el-row>
    </el-dialog>
    <el-container>
        <el-main>
            <el-row justify="center">
                <el-form :model="form" label-width="120px">
                    <el-form-item label="用户名">
                        <el-input v-model="form.username" />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.password" type="password" />
                    </el-form-item>
                    <el-form-item label="验证码">
                        <el-input v-model="form.code" style="width: 75%" />
                        <img :src="img" @click="getKaptcha">
                    </el-form-item>
                    <el-row>
                        <el-col :span="3">
                            <el-form-item>
                                <el-button type="primary" @click="login">登录</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item>
                                <el-button type="" @click="registerVisible = true">注册</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item>
                                <el-button type="" @click="login">忘记密码</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import store from "@/store";
import axios from "axios"
export default {
    data() {
        return {
            img: null,
            form: {},
            registerVisible: false,
            registerForm: {},
            result: null,
            resultVisible: null,
        }
    },
    created() {
        this.getKaptcha();
    },
    methods: {
        getKaptcha() {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/kaptcha',
                responseType: 'blob',


            }).then((res) => {
                console.log("res", res);
                const url = URL.createObjectURL(res.data);
                this.img = url;


            });
        },
        register() {
            this.registerVisible = false;
            const jsondata = {
                registerForm: this.registerForm
            }
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/register',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsondata,
            }).then((res) => {
                console.log("res", res);
                this.result = res.data;

                if (this.result == "success") {
                    this.result = "注册成功！请前往邮箱激活账号";
                }
                this.resultVisible = true;

            });
        },
        login() {
            const jsondata = {
                form: this.form
            }
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: jsondata,
            }).then((res) => {
                console.log("res", res);
                this.result = res.data;

                if (this.result == "code") {
                    this.result = "验证码错误！";
                    this.resultVisible = true;
                } else if (this.result == "password") {
                    this.result = "密码错误！"
                    this.resultVisible = true;
                } else if (this.result == "activation") {
                    this.result = "未激活！"
                    this.resultVisible = true;
                } else if (this.result == "none") {
                    this.result = "用户不存在！";
                    this.resultVisible = true;
                } else {
                    store.state.ticket = this.result;
                    this.resultVisible = true;
                }


            });
        }
    }
}
</script>
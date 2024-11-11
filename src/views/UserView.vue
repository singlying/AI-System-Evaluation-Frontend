<template>

    
    
    <el-container>
  
      <el-header>
        <el-card style="" shadow="always" >个人信息</el-card>
  
      </el-header>
  
  
      <el-main>
      
      <el-row justify="center">
        <el-column :span="22">
          <el-descriptions title="详细信息" :column="3" size="large" border>
            <el-descriptions-item width="200px">
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <User />
                  </el-icon>
                  用户名
                </div>
              </template>
              <div v-if="!isEditingName">
                {{ userName }}
                <el-button class="ebutton" @click="editName" circle size="small"><el-icon :style="iconStyle">
                    <Edit />
                  </el-icon></el-button>
              </div>
              <div v-else>
                <el-input v-model="userName">
                  <template #append>
                    <el-button class="ebutton" size="small" @click="saveName"><el-icon :style="iconStyle">
                        <Check />
                      </el-icon></el-button>
                  </template>
                </el-input>

              </div>
            </el-descriptions-item>

           
            <el-descriptions-item width="200px">
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <Iphone />
                  </el-icon>
                  电子邮箱
                </div>
                
              </template>
              <div v-if="!isEditingName">
                {{ userName }}
                <el-button class="ebutton" @click="editName" circle size="small"><el-icon :style="iconStyle">
                    <Edit />
                  </el-icon></el-button>
              </div>
              <div v-else>
                <el-input v-model="userName">
                  <template #append>
                    <el-button class="ebutton" size="small" @click="saveName"><el-icon :style="iconStyle">
                        <Check />
                      </el-icon></el-button>
                  </template>
                </el-input>

              </div>
           
            </el-descriptions-item>
          </el-descriptions>
        </el-column>
      </el-row>
      <el-row class="head" justify="center" style="margin: 10px;">
        <div class="password">
            <el-button type="primary" class="pdbutton" @click="isEditingPassword = true"><el-icon class="el-icon--left">
                <Edit></Edit>
              </el-icon>修改密码</el-button>
          </div>
        
      </el-row>
    </el-main>
    </el-container>
  </template>
  
  <script>
  import router from "@/router";
  import {
    Edit,
    User,
    Iphone,
    Check,
    Plus,
  } from "@element-plus/icons-vue"
  import axios from "axios";
  import { ElMessage } from "element-plus";
  import { ref } from "vue";
  
  export default {
    created() {
     
    },
    methods: {
      onChange(uploadFile) {
        if (uploadFile.raw.type !== 'image/jpeg' && uploadFile.raw.type !== 'image/png') {
          ElMessage.error('请上传JPG/PNG格式文件')
          return false
        } else if (uploadFile.raw.size / 1024 / 1024 > 10) {
          ElMessage.error('文件不能超过10MB!')
          return false
        }
        console.log(uploadFile);
        var reader = new FileReader();
        reader.readAsDataURL(uploadFile.raw);
        reader.onload = (e) => {
          this.newProfile = e.target.result;
          console.log(this.newProfile);
        };
        return true
      },
      getDate(n) {
        n = new Date(1000 * n)
        return n.toLocaleDateString().replace(/\//g, "-") + " " + n.toTimeString().substr(0, 8)
      },
      goHome() {
        router.push({ name: "main" });
      },
      viewAllScale() {
        router.push({ name: "scaleRecord" });
      },
      viewAllDocument() {
        router.push({ name: "documentRecord" });
      },
      editName() {
        this.isEditingName = true;
      },
      saveName() {
        this.isEditingName = false;
        axios({
          method: 'put',
          url: 'api/user/info',
          data: {
            id: this.id,
            nickname: this.userName,
          }
        })
      },
      editGender() {
        this.isEditingGender = true;
      },
      saveGender() {
        this.isEditingGender = false;
        var sex = "";
        if (this.gender == "男")
          sex = "m";
        else
          sex = "f";
        axios({
          method: 'put',
          url: 'api/user/info',
          data: {
            id: this.id,
            sex: sex,
          }
        })
      },
      editAge() {
        this.isEditingAge = true;
      },
      saveAge() {
        this.isEditingAge = false;
        axios({
          method: 'put',
          url: 'api/user/info',
          data: {
            id: this.id,
            age: this.age,
          }
        })
      },
      savePassword() {
        this.isEditingPassword = false;
        axios({
          method: 'put',
          url: 'api/user/passwd',
          data: {
            id: this.id,
            userType: "client",
            oldPasswd: this.form.oldPassword,
            newPasswd: this.form.newPassword,
          }
        }).then((res) => {
          if (res.status == 200) {
            ElMessage({
              message: "修改成功",
              type: "success",
              showClose: true,
              duration: 2000,
            });
          }
          else {
            ElMessage({
              message: "密码错误",
              type: "error",
              showClose: true,
              duration: 2000,
            });
          }
        });
        this.form.oldPassword = "";
        this.form.newPassword = "";
      },
      editPassword() {
        if (this.form.newPassword == this.form.oldPassword) {
          ElMessage({
            message: "不能输入相同的密码",
            type: "error",
            showClose: true,
            duration: 2000,
          });
        }
        else if (this.form.newPassword != "" && this.form.oldPassword != "")
          this.savePassword();
  
      },
      editAvatar() {
        axios({
          method: 'post',
          url: 'api/user/uploadProfile',
          data: {
            base64: this.newProfile,
            id: this.id,
            userType: "client",
          }
        }).then((res) => {
          if (res.status == 200) {
            ElMessage({
              message: "修改成功",
              type: "success",
              showClose: true,
              duration: 2000,
            });
          }
          else {
            ElMessage({
              message: "修改失败",
              type: "error",
              showClose: true,
              duration: 2000,
            });
          }
        });
        this.isEditingAvatar = false;
        this.squareUrl = this.newProfile;
      },
      viewResult(scaleRecordId) {
        this.$router.push({
          path: '/scaleResult',
          query: {
            recordId: scaleRecordId,
          }
        })
      }
    },
    components: {
      Edit,
      User,
      Iphone,
      Check,
      Plus,
    },
    data() {
      return {
        squareUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        userName: "aaa",
        age: 0,
        gender: "1",
        telephone: "1",
        isEditingName: false,
        isEditingGender: false,
        isEditingAge: false,
        isEditingPassword: false,
        isEditingAvatar: false,
        newProfile: null,
        mail: "aaaaa",
        isShowingResult: true,
        genders: [
          "男", "女",
        ],
        recentScale: [
        ],
        recentDocument: [
  
        ],
        form: { oldPassword: "", newPassword: "" },
        rules: {
          oldPassword: [{ required: true, message: '不能为空', trigger: 'blur' },],
          newPassword: [{ required: true, message: '不能为空', trigger: 'blur' },],
        }
      };
    },
  }
  </script>
  

  
<template>
    <el-container>
        
        <el-header>
            <el-card style="" shadow="always">测试记录</el-card>
        </el-header>
        <el-dialog v-model="deleteVisible" title="确认" width="30%">
            <span>真的要删除吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteVisible = false">取消</el-button>
                    <el-button type="primary" @click="deleteRecord">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="resultVisible" width="90%">
            <el-table :data="resultRecordList" style="width: 100%">
                <el-table-column prop="id" label="ID" width="60" />

                <el-table-column label="时间" width="300">
                    <template #default="scope">
                        {{ formattedDate(scope.row.time) }}
                    </template>
                </el-table-column>

                <el-table-column label="任务类型" width="200">
                    <template #default="scope">
                        <div>
                            <el-tag v-if="scope.row.missionType == 1">图像分类</el-tag>
                            <el-tag v-if="scope.row.missionType == 2">图像检索</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="测试类型" width="200">
                    <template #default="scope">
                        <div>
                            <el-tag v-if="scope.row.type == 1">准确性</el-tag>
                            <el-tag v-if="scope.row.type == 2">鲁棒性</el-tag>
                            <el-tag v-if="scope.row.type == 3">公平性</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="200">
                    <template #default="scope">
                        <div>
                            <el-tag v-if="scope.row.status == 0">测试中</el-tag>
                            <el-tag v-if="scope.row.status == 1">测试完成</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="modelId" label="模型ID" width="70" />
                <el-table-column prop="modelName" label="模型名称" width="200" />
                <el-table-column prop="datasetId" label="数据集ID" width="70"></el-table-column>
                <el-table-column prop="datasetName" label="数据集名称" width="200"></el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template #default="scope">
                        <el-button v-if="scope.row.status == 1" link type="primary" size="small"
                            @click="goRecordDetail(scope.row)">查看</el-button>
                        <el-button v-if="scope.row.status == 1" link type="primary" size="small"
                            @click="handleDelete(scope.row)">删除</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-main>
            <el-row>
                <el-col :span="12">
                    <el-input v-model="input" class="w-50 m-2" placeholder="搜索" :prefix-icon="Search" />
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-col>

            </el-row>
            <el-row><el-table :data="record" style="width: 100%">
                    <el-table-column prop="id" label="ID" width="60" />

                    <el-table-column label="时间" width="150">
                        <template #default="scope">
                            {{ formattedDate(scope.row.time) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="任务类型" width="100">
                        <template #default="scope">
                            <div>
                                <el-tag v-if="scope.row.missionType == 1">图像分类</el-tag>
                                <el-tag v-if="scope.row.missionType == 2">图像检索</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="测试类型" width="100">
                        <template #default="scope">
                            <div>
                                <el-tag v-if="scope.row.type == 1">准确性</el-tag>
                                <el-tag v-if="scope.row.type == 2">鲁棒性</el-tag>
                                <el-tag v-if="scope.row.type == 3">公平性</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template #default="scope">
                            <div>
                                <el-tag v-if="scope.row.status == 0">测试中</el-tag>
                                <el-tag v-if="scope.row.status == 1">测试完成</el-tag>
                                <el-tag v-if="scope.row.status == 2">测试失败</el-tag>

                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="modelId" label="模型ID" width="100" />
                    <el-table-column prop="modelName" label="模型名称" width="100" />
                    <el-table-column prop="datasetId" label="数据集ID" width="100"></el-table-column>
                    <el-table-column prop="datasetName" label="数据集名称" width="100"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="150">
                        <template #default="scope">
                            <el-button v-if="scope.row.status == 1" link type="primary" size="small"
                                @click="goRecordDetail(scope.row)">查看</el-button>
                            <el-button v-if="scope.row.status == 1 || scope.row.status == 2" link type="primary" size="small"
                                @click="handleDelete(scope.row)">删除</el-button>

                        </template>
                    </el-table-column>
                </el-table></el-row>
            <el-row justify="center"><el-col :span="11">
                    <div>
                        <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="page"
                            @current-change="getNewPage" :page-size="12"/>
                    </div>
                </el-col></el-row>

        </el-main>
        <el-main style="margin: 20px 30px; background: #ffffff">

            <el-row justify="center" class="tabs">
                <el-col :span="23">

                </el-col>
            </el-row>

        </el-main>
    </el-container>

</template>


<script>
import router from "@/router";
import axios from "axios";
import { } from "@element-plus/icons-vue";
import moment from 'moment';
export default {
    created() {
        this.getRecord(1);

    },
    methods: {
        getNewPage(){
            this.getRecord(this.page);
        },
        formattedDate(date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },
        getRecord(page) {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/getRecord',
                params: {
                    page: page,
                }

            }).then((res) => {
                console.log("res", res);
                this.record = res.data;
            });
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/getRecordTotal',
                
            }).then((res) => {
                console.log("res", res);
                this.total = res.data;
            });
        },
        goRecordDetail(row) {
            if (row.status == 1) {
                console.log("content", row.content);
                console.log(row.content[0])
                this.$router.push({
                    path: "/recordDetail",
                    query: {
                        id: row.id,
                        type: row.type,
                        missionType: row.missionType
                    },
                });
            }



        },
        handleSearch() {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/searchRecord',
                params: {
                    keywords: this.input,
                }
            }).then((res) => {
                console.log("res", res);
                this.resultRecordList = res.data
            });
            this.resultVisible = true;
        },
        handleDelete(row) {
            this.deleteId = row.id;
            this.deleteVisible = true;
        },
        deleteRecord() {
            axios({
                method: 'get',
                baseURL: import.meta.env.VITE_APP_BASE_API,
                url: '/api/deleteRecord',
                params: {
                    id: this.deleteId,

                }
            }).then((res) => {
                console.log("res", res);
                this.getRecord(1);
                this.page = 1;
                this.deleteVisible = false;
                this.resultVisible = false;
            });
        }
    },
    components: {},
    data() {
        return {
            record: [],
            input: "",
            resultRecordList: [],
            total: 1,
            page: 1,
            resultVisible: false,
            deleteVisible: false,
        };
    },
};
</script>

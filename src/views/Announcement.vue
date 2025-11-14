<template>
    <v-container>
        <div class="d-flex justify-center align-center">
            <h2 class="mb-4">📢 Announcements</h2>
        </div>
        <div class="d-flex justify-center align-center">
            <v-btn v-if="store.user?.role === 'admin'" color="success" @click="dialog = true" class="mb-4">
                Create Announcement
            </v-btn>
        </div>
        <v-row>
            <v-col cols="12" v-for="announcement in announcements" :key="announcement.id">
                <v-card outlined class="mb-4">


                    <v-card-title class="headline">{{ announcement.title }}</v-card-title>
                    <v-card-text>
                        <p>{{ announcement.content }}</p>
                        <small class="text-muted">
                            Posted by {{ announcement.author.name }} on {{ formatDate(announcement.createdAt) }}
                        </small>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>Create New Announcement</v-card-title>
            <v-card-text>
                <v-text-field v-model="newAnnouncement.title" label="Title" />
                <v-textarea v-model="newAnnouncement.content" label="Content" rows="4" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="dialog = false">Cancel</v-btn>
                <v-btn color="primary" text @click="submitAnnouncement">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import { authStore } from '../store/authStore'
export default {
    name: 'Announcements',
    data() {
        return {
            announcements: [],
            store: authStore(),
            dialog: false,
            newAnnouncement: {
                title: '',
                content: ''
            }
        };
    },
    async mounted() {
        try {
            const res = await axios.get('http://localhost:5000/announcement');
            this.announcements = res.data;
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    },
    methods: {
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString();
        },
        async submitAnnouncement() {
            try {
                await axios.post('http://localhost:5000/announcement', {
                    title: this.newAnnouncement.title,
                    content: this.newAnnouncement.content,
                    userId: this.store.user?.id
                });
                this.dialog = false;
                this.newAnnouncement.title = '';
                this.newAnnouncement.content = '';
                const res = await axios.get('http://localhost:5000/announcement');
                this.announcements = res.data;
            } catch (error) {
                console.error("Error creating announcement:", error);
            }
        }
    }
};
</script>

<style scoped>
.text-muted {
    color: #6c757d;
}
</style>

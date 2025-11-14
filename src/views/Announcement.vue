<template>
  <v-container>
    <div class="text-center mb-4">
      <h2>📢 Announcements</h2>
    </div>

    <div class="text-center mb-4">
      <v-btn
        v-if="store.user?.role === 'admin'"
        color="success"
        @click="dialog = true"
      >
        Create Announcement
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" v-for="announcement in announcements" :key="announcement.id">
        <v-card outlined class="mb-4">
          <v-card-title>{{ announcement.title }}</v-card-title>
          <v-card-text>
            <p>{{ announcement.content }}</p>
            <small class="text-muted">
              Posted by {{ announcement.author.name }} on {{ formatDate(announcement.createdAt) }}
            </small>
          </v-card-text>

        <v-card-actions>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title @click="loadComments(announcement.id)">
         Comments
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-if="announcement.comments?.length">
          <div v-for="comment in announcement.comments" :key="comment.id" class="mb-3">
            <strong>{{ comment.author.name }}</strong>
            <p class="mb-1">{{ comment.content }}</p>
          </div>
        </div>
        <div v-else class="text-center text-muted py-4">
          <em>No comments yet</em>
        </div>

        <v-divider class="my-2"></v-divider>

        <v-text-field
          v-model="announcement.newComment"
          label="Add a comment"
          variant="outlined"
          dense
          hide-details
          class="flex-grow-1"
        />
        <v-btn color="success" @click="submitComment(announcement)">
          Post
        </v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</v-card-actions>

        </v-card>
      </v-col>
    </v-row>
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
          <v-btn color="primary" @click="submitAnnouncement">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { authStore } from '../store/authStore'
import api from '../plugins/api'

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
    await this.fetchAnnouncements();
  },
  methods: {
    async fetchAnnouncements() {
      try {
        const res = await api.get('/announcement');
        this.announcements = res.data.map(a => ({
          ...a,
          comments: [],
          newComment: '',
          showComments: false
        }));
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    async submitAnnouncement() {
      try {
        await api.post('/announcement', {
          title: this.newAnnouncement.title,
          content: this.newAnnouncement.content,
          userId: this.store.user?.id
        });
        this.dialog = false;
        this.newAnnouncement.title = '';
        this.newAnnouncement.content = '';
        await this.fetchAnnouncements();
      } catch (error) {
        console.error("Error creating announcement:", error);
      }
    },
    async loadComments(announcementId) {
      try {
        const res = await api.get(`/comment/${announcementId}`);
        const announcement = this.announcements.find(a => a.id === announcementId);
        if (announcement) {
          announcement.comments = res.data;
        }
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    },
    async submitComment(announcement) {
      if (!announcement.newComment) return;
      try {
        await api.post('/comment', {
          content: announcement.newComment,
          userId: this.store.user?.id,
          announcementId: announcement.id
        });
        announcement.newComment = '';
        await this.loadComments(announcement.id);
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  }
};
</script>

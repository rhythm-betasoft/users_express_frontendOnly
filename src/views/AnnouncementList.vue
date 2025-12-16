<template>
  <v-container>
    <div class="text-center mb-4">
      <h2>Announcements</h2>
    </div>

    <div class="text-center mb-4">
      <v-btn
        v-if="store.user?.role === roles.ADMIN"
        color="success"
        @click="openAddAnnouncementDialog"
      >
        Create Announcement
      </v-btn>
    </div>

    <v-row>
      <v-col
        cols="12"
        v-for="announcement in announcements"
        :key="announcement.id"
      >
        <v-card outlined class="mb-4">
          <v-card-title>{{ announcement.title }}</v-card-title>
          <v-card-text>
            <p>{{ announcement.content }}</p>
            <small class="text-muted">
              Posted by {{ announcement.author.name }}
              on {{ $utils.formatDate(announcement.createdAt) }}
            </small>
          </v-card-text>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title @click="loadComments(announcement.id)">
                Comments
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-if="announcement.comments && announcement.comments.length">
                  <div
                    v-for="comment in announcement.comments"
                    :key="comment.id"
                    class="mb-3"
                  >
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <add-announcement-dialog
    v-if="addAnnouncementDialog"
    @closed="closeAddAnnouncementDialog"
  />
</template>

<script>
import { authStore } from '@/store/authStore'
import { roles } from '@/enums/roles'
import AddAnnouncementDialog from '@/components/Dialogs/AddAnnouncementDialog.vue'

export default {
  components: { AddAnnouncementDialog },
  data() {
    return {
      announcements: [],
      store: authStore(),
      addAnnouncementDialog: false,
      roles,
    }
  },
  mounted() {
    this.fetchAnnouncements()
  },
  methods: {
    fetchAnnouncements() {
      this.$api.get('/announcements/list')
        .then(({ data }) => {
          this.announcements = data.data.map(a => ({
            ...a,
            comments: a.comments || [],
            newComment: ''
          }))
        })
        .catch(error => {
          this.$toast.show(error, 'error')
        })
    },
    loadComments(announcementId) {
      this.$api.get(`/announcements/${announcementId}`)
        .then(({ data }) => {
          const index = this.announcements.findIndex(a => a.id === announcementId)
          if (index !== -1) {
            this.announcements[index].comments = data.comments || []
          }
        })
        .catch(error => {
          this.$toast.show(error, 'error')
        })
    },
    submitComment(announcement) {
      if (!announcement.newComment) return
      this.$api.post('/comment', {
        content: announcement.newComment,
        userId: this.store.user.id,
        announcementId: announcement.id
      })
        .then(({ data }) => {
          announcement.newComment = ''
          this.$toast.show(data.message, 'success')
          this.loadComments(announcement.id)
        })
        .catch(error => {
          this.$toast.show(error, 'error')
        })
    },
    closeAddAnnouncementDialog() {
      this.addAnnouncementDialog = false
    },
    openAddAnnouncementDialog() {
      this.addAnnouncementDialog = true
    }
  }
}
</script>

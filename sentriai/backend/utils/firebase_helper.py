import firebase_admin
from firebase_admin import credentials, messaging, firestore, storage
from datetime import datetime
import json
import os


class FirebaseHelper:
    """
    Firebase integration for SentriAI
    - Push notifications to mobile apps
    - Cloud storage for snapshots and videos
    - Firestore database for persistent data
    """
    
    def __init__(self, credentials_path=None):
        """
        Initialize Firebase Admin SDK
        :param credentials_path: Path to Firebase service account JSON file
        """
        self.initialized = False
        self.db = None
        self.bucket = None
        
        try:
            # Check if Firebase is already initialized
            if not firebase_admin._apps:
                if credentials_path and os.path.exists(credentials_path):
                    cred = credentials.Certificate(credentials_path)
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': 'your-project-id.appspot.com'  # Replace with your bucket
                    })
                else:
                    # Try to initialize with default credentials (for deployment)
                    firebase_admin.initialize_app()
                
                self.initialized = True
                self.db = firestore.client()
                self.bucket = storage.bucket()
                print("✅ Firebase initialized successfully")
            else:
                self.initialized = True
                self.db = firestore.client()
                self.bucket = storage.bucket()
                print("✅ Firebase already initialized")
                
        except Exception as e:
            print(f"⚠️ Firebase initialization failed: {str(e)}")
            print("Running without Firebase support")
            self.initialized = False
    
    
    # ==================== PUSH NOTIFICATIONS ====================
    
    def send_push_notification(self, device_token, title, body, data=None):
        """
        Send push notification to a specific device
        :param device_token: FCM device token
        :param title: Notification title
        :param body: Notification body
        :param data: Additional data payload (dict)
        :return: Message ID or None
        """
        if not self.initialized:
            print("Firebase not initialized, skipping notification")
            return None
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=device_token
            )
            
            response = messaging.send(message)
            print(f"✅ Notification sent: {response}")
            return response
            
        except Exception as e:
            print(f"❌ Failed to send notification: {str(e)}")
            return None
    
    def send_alert_notification(self, alert_data, device_tokens):
        """
        Send alert notification to multiple responders
        :param alert_data: Alert information (dict)
        :param device_tokens: List of FCM device tokens
        :return: Success count
        """
        if not self.initialized or not device_tokens:
            return 0
        
        title = f"🚨 {alert_data.get('severity', 'ALERT')}: {alert_data.get('type', 'Unknown')}"
        body = alert_data.get('description', 'New alert detected')
        
        data = {
            'alert_id': str(alert_data.get('id', '')),
            'severity': alert_data.get('severity', 'MEDIUM'),
            'type': alert_data.get('type', ''),
            'zone': alert_data.get('zone', ''),
            'timestamp': alert_data.get('timestamp', datetime.now().isoformat()),
            'action': 'view_alert'
        }
        
        success_count = 0
        
        for token in device_tokens:
            try:
                self.send_push_notification(token, title, body, data)
                success_count += 1
            except Exception as e:
                print(f"Failed to send to {token}: {str(e)}")
        
        return success_count
    
    def send_multicast_notification(self, tokens, title, body, data=None):
        """
        Send notification to multiple devices efficiently
        :param tokens: List of device tokens (max 500)
        :param title: Notification title
        :param body: Notification body
        :param data: Additional data
        :return: Success and failure counts
        """
        if not self.initialized or not tokens:
            return {'success': 0, 'failure': 0}
        
        try:
            message = messaging.MulticastMessage(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                tokens=tokens[:500]  # FCM limit
            )
            
            response = messaging.send_multicast(message)
            print(f"✅ Multicast sent: {response.success_count} success, {response.failure_count} failures")
            
            return {
                'success': response.success_count,
                'failure': response.failure_count
            }
            
        except Exception as e:
            print(f"❌ Multicast failed: {str(e)}")
            return {'success': 0, 'failure': len(tokens)}
    
    def send_topic_notification(self, topic, title, body, data=None):
        """
        Send notification to all devices subscribed to a topic
        :param topic: Topic name (e.g., 'responders', 'security')
        :param title: Notification title
        :param body: Notification body
        :param data: Additional data
        """
        if not self.initialized:
            return None
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                topic=topic
            )
            
            response = messaging.send(message)
            print(f"✅ Topic notification sent to '{topic}': {response}")
            return response
            
        except Exception as e:
            print(f"❌ Topic notification failed: {str(e)}")
            return None
    
    
    # ==================== FIRESTORE DATABASE ====================
    
    def save_alert_to_firestore(self, alert_data):
        """
        Save alert to Firestore database
        :param alert_data: Alert information
        :return: Document reference or None
        """
        if not self.initialized:
            return None
        
        try:
            doc_ref = self.db.collection('alerts').document()
            alert_data['firestore_id'] = doc_ref.id
            alert_data['created_at'] = firestore.SERVER_TIMESTAMP
            
            doc_ref.set(alert_data)
            print(f"✅ Alert saved to Firestore: {doc_ref.id}")
            return doc_ref
            
        except Exception as e:
            print(f"❌ Failed to save alert: {str(e)}")
            return None
    
    def get_alerts_from_firestore(self, limit=50, severity=None):
        """
        Retrieve alerts from Firestore
        :param limit: Maximum number of alerts to retrieve
        :param severity: Filter by severity (optional)
        :return: List of alerts
        """
        if not self.initialized:
            return []
        
        try:
            query = self.db.collection('alerts').order_by('created_at', direction=firestore.Query.DESCENDING)
            
            if severity:
                query = query.where('severity', '==', severity)
            
            query = query.limit(limit)
            
            docs = query.stream()
            alerts = [doc.to_dict() for doc in docs]
            
            print(f"✅ Retrieved {len(alerts)} alerts from Firestore")
            return alerts
            
        except Exception as e:
            print(f"❌ Failed to retrieve alerts: {str(e)}")
            return []
    
    def update_alert_status(self, alert_id, status, user_id=None):
        """
        Update alert status in Firestore
        :param alert_id: Firestore document ID
        :param status: New status
        :param user_id: User who updated the status
        """
        if not self.initialized:
            return False
        
        try:
            doc_ref = self.db.collection('alerts').document(alert_id)
            
            update_data = {
                'status': status,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            if user_id:
                update_data['updated_by'] = user_id
            
            doc_ref.update(update_data)
            print(f"✅ Alert {alert_id} updated to {status}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to update alert: {str(e)}")
            return False
    
    def save_analytics_data(self, analytics_data):
        """
        Save analytics data to Firestore
        :param analytics_data: Analytics information
        """
        if not self.initialized:
            return None
        
        try:
            doc_ref = self.db.collection('analytics').document()
            analytics_data['timestamp'] = firestore.SERVER_TIMESTAMP
            doc_ref.set(analytics_data)
            
            print(f"✅ Analytics data saved: {doc_ref.id}")
            return doc_ref
            
        except Exception as e:
            print(f"❌ Failed to save analytics: {str(e)}")
            return None
    
    def save_device_token(self, user_id, device_token, device_info=None):
        """
        Save or update device token for push notifications
        :param user_id: User identifier
        :param device_token: FCM device token
        :param device_info: Additional device info (optional)
        """
        if not self.initialized:
            return False
        
        try:
            doc_ref = self.db.collection('devices').document(user_id)
            
            data = {
                'token': device_token,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            if device_info:
                data['device_info'] = device_info
            
            doc_ref.set(data, merge=True)
            print(f"✅ Device token saved for user: {user_id}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to save device token: {str(e)}")
            return False
    
    def get_all_device_tokens(self, user_role=None):
        """
        Get all device tokens for sending notifications
        :param user_role: Filter by user role (e.g., 'responder', 'security')
        :return: List of device tokens
        """
        if not self.initialized:
            return []
        
        try:
            query = self.db.collection('devices')
            
            if user_role:
                query = query.where('role', '==', user_role)
            
            docs = query.stream()
            tokens = [doc.to_dict().get('token') for doc in docs if doc.to_dict().get('token')]
            
            print(f"✅ Retrieved {len(tokens)} device tokens")
            return tokens
            
        except Exception as e:
            print(f"❌ Failed to retrieve tokens: {str(e)}")
            return []
    
    
    # ==================== CLOUD STORAGE ====================
    
    def upload_snapshot(self, image_data, filename, folder='snapshots'):
        """
        Upload camera snapshot to Firebase Storage
        :param image_data: Image bytes or file path
        :param filename: Name for the file
        :param folder: Storage folder
        :return: Public URL or None
        """
        if not self.initialized:
            return None
        
        try:
            blob = self.bucket.blob(f"{folder}/{filename}")
            
            if isinstance(image_data, bytes):
                blob.upload_from_string(image_data, content_type='image/jpeg')
            else:
                blob.upload_from_filename(image_data)
            
            # Make publicly accessible (optional)
            blob.make_public()
            
            url = blob.public_url
            print(f"✅ Snapshot uploaded: {url}")
            return url
            
        except Exception as e:
            print(f"❌ Failed to upload snapshot: {str(e)}")
            return None
    
    def upload_video_clip(self, video_path, filename, folder='video_clips'):
        """
        Upload video clip to Firebase Storage
        :param video_path: Path to video file
        :param filename: Name for the file
        :param folder: Storage folder
        :return: Public URL or None
        """
        if not self.initialized:
            return None
        
        try:
            blob = self.bucket.blob(f"{folder}/{filename}")
            blob.upload_from_filename(video_path, content_type='video/mp4')
            
            blob.make_public()
            url = blob.public_url
            
            print(f"✅ Video uploaded: {url}")
            return url
            
        except Exception as e:
            print(f"❌ Failed to upload video: {str(e)}")
            return None
    
    def delete_file(self, file_path):
        """
        Delete file from Firebase Storage
        :param file_path: Path to file in storage
        """
        if not self.initialized:
            return False
        
        try:
            blob = self.bucket.blob(file_path)
            blob.delete()
            print(f"✅ File deleted: {file_path}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to delete file: {str(e)}")
            return False
    
    
    # ==================== UTILITY METHODS ====================
    
    def create_alert_with_notification(self, alert_data, send_notification=True):
        """
        Create alert and send notification in one operation
        :param alert_data: Alert information
        :param send_notification: Whether to send push notification
        :return: Alert document reference
        """
        # Save to Firestore
        doc_ref = self.save_alert_to_firestore(alert_data)
        
        # Send notification if requested
        if send_notification and doc_ref:
            severity = alert_data.get('severity', 'MEDIUM')
            
            # Send to appropriate topic based on severity
            if severity in ['HIGH', 'CRITICAL']:
                topic = 'emergency_responders'
            else:
                topic = 'all_responders'
            
            self.send_topic_notification(
                topic=topic,
                title=f"🚨 {severity} Alert",
                body=alert_data.get('description', 'New alert detected'),
                data={'alert_id': doc_ref.id, 'severity': severity}
            )
        
        return doc_ref
    
    def batch_save_analytics(self, analytics_list):
        """
        Batch save multiple analytics entries
        :param analytics_list: List of analytics data
        :return: Number of successful saves
        """
        if not self.initialized:
            return 0
        
        try:
            batch = self.db.batch()
            count = 0
            
            for analytics_data in analytics_list:
                doc_ref = self.db.collection('analytics').document()
                analytics_data['timestamp'] = firestore.SERVER_TIMESTAMP
                batch.set(doc_ref, analytics_data)
                count += 1
            
            batch.commit()
            print(f"✅ Batch saved {count} analytics entries")
            return count
            
        except Exception as e:
            print(f"❌ Batch save failed: {str(e)}")
            return 0
    
    def test_connection(self):
        """
        Test Firebase connection
        :return: Connection status
        """
        if not self.initialized:
            return {
                'connected': False,
                'error': 'Firebase not initialized'
            }
        
        try:
            # Try a simple Firestore operation
            test_ref = self.db.collection('_system_test').document('test')
            test_ref.set({'test': True, 'timestamp': firestore.SERVER_TIMESTAMP})
            test_ref.delete()
            
            return {
                'connected': True,
                'firestore': True,
                'storage': self.bucket is not None,
                'messaging': True
            }
            
        except Exception as e:
            return {
                'connected': False,
                'error': str(e)
            }


# Example usage and testing
if __name__ == "__main__":
    print("🔥 Firebase Helper - Test Mode\n")
    print("=" * 60)
    
    # Initialize (you'll need to provide your credentials path)
    firebase = FirebaseHelper(credentials_path='path/to/serviceAccountKey.json')
    
    if firebase.initialized:
        print("\n✅ Firebase initialized successfully\n")
        
        # Test 1: Connection test
        print("📡 Testing Firebase connection...")
        status = firebase.test_connection()
        print(f"Connection Status: {status}\n")
        
        # Test 2: Save alert to Firestore
        print("💾 Testing Firestore save...")
        test_alert = {
            'type': 'OVERCROWDING',
            'severity': 'HIGH',
            'description': 'High density detected in Zone A',
            'zone': 'ZONE_A',
            'person_count': 350,
            'risk_score': 0.85
        }
        doc_ref = firebase.save_alert_to_firestore(test_alert)
        print(f"Alert saved with ID: {doc_ref.id if doc_ref else 'Failed'}\n")
        
        # Test 3: Send test notification (requires valid device token)
        print("📲 Testing push notification...")
        # firebase.send_push_notification(
        #     device_token='your-device-token-here',
        #     title='Test Alert',
        #     body='This is a test notification from SentriAI'
        # )
        print("(Skipped - requires valid device token)\n")
        
        # Test 4: Retrieve alerts
        print("📥 Testing alert retrieval...")
        alerts = firebase.get_alerts_from_firestore(limit=5)
        print(f"Retrieved {len(alerts)} alerts\n")
        
        print("=" * 60)
        print("✅ Firebase helper test complete!")
    else:
        print("\n❌ Firebase initialization failed")
        print("Make sure to:")
        print("1. Download your Firebase service account key JSON")
        print("2. Set the correct path in credentials_path")
        print("3. Update the storageBucket URL with your project ID")
# Timetable Assistant Using AI

A web-based AI-powered assistant designed to help users manage their schedules and tasks through an intuitive chat interface.

## Team Members
- **남현우 (Hyunwoo Nam)**
- **김태빈 (Taebin Kim)**
- **이선재 (Seonjae Lee)**

## Project Overview
Timetable Assistant Using AI is a web application that integrates an AI-driven chatbot to assist users in organizing their schedules, answering queries, and providing task management support. The application features a modern, dark-themed chat interface with a futuristic design, optimized for user comfort and engagement. The UI includes a fixed input bar, smooth scrolling, and a scroll-to-bottom button for seamless interaction.

## Features
- **Dark Theme UI**: A sleek, eye-friendly interface with a soft gray background (#1F2526) and subtle gray borders (#4B5563) to reduce eye strain.
- **Fixed Chat Input**: The message input bar is fixed at the bottom of the screen for easy access, regardless of chat history length.
- **Smooth Scrolling**: Messages automatically scroll into view with a smooth animation, and a "Scroll to Bottom" button appears when the user is not at the latest message.
- **Responsive Sidebar**: A sidebar with navigation links (e.g., TimeTable, Chat, Layouts) that integrates seamlessly with the main content area.
- **AI Interaction**: Users can send messages, and the AI responds with a simulated reply after a brief delay, mimicking a real conversation.
- **Custom Animations**: Slide-up animations for new messages to enhance the futuristic feel.

## Tech Stack
- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Tailwind CSS for responsive and utility-first styling
  - Bootstrap 5 for sidebar and layout components
  - FontAwesome for icons
  - Google Fonts (Inter) for modern typography
- **Libraries**:
  - Simple DataTables for potential table integration
  - Chart.js for future visualization features
- **Deployment**:
  - Static files served via a web server (e.g., Flask or Node.js, to be determined)

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/timetable-assistant-ai.git
   cd timetable-assistant-ai
   ```

2. **Set Up Dependencies**:
   - Ensure you have a web server or local development environment (e.g., Live Server in VS Code).
   - No additional dependencies are required as all libraries are loaded via CDN.

3. **Run the Application**:
   - Open `index.html` in a browser or serve the `static` folder using a local server.
   - Example using Python's HTTP server:
     ```bash
     python -m http.server 8000
     ```
   - Navigate to `http://localhost:8000` in your browser.

## Usage
1. Open the application in a web browser.
2. Use the sidebar to navigate between features (e.g., TimeTable, Chat).
3. In the Chat section, type a message in the fixed input bar at the bottom and press Enter or click "Send".
4. The AI will respond with a simulated reply after a short delay.
5. Use the "Scroll to Bottom" button (appears when not at the latest message) to jump to the newest message.

## Future Improvements
- Integrate a backend server for real AI responses (e.g., using xAI's Grok API).
- Add timetable creation and management features with interactive UI.
- Implement persistent chat history using local storage or a database.
- Enhance accessibility with keyboard navigation and screen reader support.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by modern chat applications and AI assistants like Grok.
- Thanks to the open-source community for providing tools like Tailwind CSS, Bootstrap, and FontAwesome.
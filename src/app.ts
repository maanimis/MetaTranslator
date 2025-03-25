/*
// Function to send a message
const sendMessage = (message) => {
  GM_setValue('sharedMessage', message);
  console.log('Message sent:', message);
};

// Listen for messages from other tabs
GM_addValueChangeListener(
  'sharedMessage',
  (name, old_value, new_value, remote) => {
    if (remote) {
      console.log('Received message:', new_value);
    }
  },
);

// Add menu commands for sending messages
const addMenuCommands = () => {
  GM_registerMenuCommand('Send Default Message to Other Tabs', () => {
    const defaultMessage = `Hello from another tab at ${new Date().toLocaleTimeString()}`;
    sendMessage(defaultMessage);
  });

  GM_registerMenuCommand('Send Selected Text as Message', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      sendMessage(selectedText);
    } else {
      console.log('No text selected.');
    }
  });
};

// Initialize the script
const init = () => {
  addMenuCommands();
  // document.addEventListener('mousedown', handleShiftClick);
  console.log(
    'Userscript Loaded: Use Tampermonkey menu or Shift+Left Click to send messages.',
  );
};

init(); // Run the initialization function

// Event listener for Shift + Left Click
// const handleShiftClick = (e) => {
//   if (e.shiftKey && e.button === 0) {
//     // Shift + Left Click (button 0 is the left mouse button)
//     const shiftClickMessage = `Hello from Shift + Left Click at ${new Date().toLocaleTimeString()}`;
//     sendMessage(shiftClickMessage);
//   }
// };

*/

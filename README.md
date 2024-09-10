# EECS 281 Party Chrome Extension 🎉

**EECS 281 Party** is a Chrome extension that celebrates your success by throwing a **confetti party** 🎊 when your submission passes all the test cases in the EECS 281 project autograder. Add a bit of excitement to your coding achievements!

---

## Features

- Automatically triggers a confetti animation when all test cases pass on the EECS 281 autograder.
- Helps you celebrate your hard-earned success with a visual treat!

---

## Installation Guide

### Prerequisites

- **Google Chrome**: Make sure you have the latest version installed.
- **Extension Source Code**: Either clone the repository or download the latest release of the source code (ZIP).

---

### Installation Steps

#### Option 1: Clone the Repository

1. **Clone the Repository**:  
   If you have Git installed, open a terminal or command prompt and run the following command to clone the extension's source code to your machine:
   ```bash
   git clone https://github.com/lunathanael/EECS_281_Party.git
   ```

2. **Open Chrome's Extensions Page**:  
   In **Google Chrome**, type `chrome://extensions/` in the address bar and press **Enter**. This will open Chrome's **Extensions** management page.

3. **Enable Developer Mode**:  
   In the top-right corner of the **Extensions** page, toggle the **Developer mode** switch to ON. This enables you to load unpacked extensions.

4. **Load the Unpacked Extension**:  
   - Click the **Load unpacked** button in the top-left corner of the **Extensions** page.
   - In the file dialog that appears, navigate to the folder where you cloned the repository (e.g., `EECS_281_Party`).
   - Select the folder that contains the `manifest.json` file (this should be the root directory of the extension).

5. **Verify the Installation**:  
   Once the extension is loaded, you should see it appear in your list of extensions. You will also see the extension’s icon in the Chrome toolbar.

6. **Test the Extension**:  
   Go to the EECS 281 autograder, submit your project, and when all test cases pass, enjoy the confetti celebration!

#### Option 2: Download from Latest Release

1. **Download the Latest Release**:  
   - Go to the [Releases](https://github.com/lunathanael/EECS_281_Party/releases) page of this repository.
   - Download the source code ZIP file for the **latest release**.
   - Extract the ZIP file to a directory of your choice.

2. **Open Chrome's Extensions Page**:  
   - In **Google Chrome**, type `chrome://extensions/` in the address bar and press **Enter** to open the **Extensions** management page.

3. **Enable Developer Mode**:  
   - Toggle the **Developer mode** switch in the top-right corner of the Extensions page to ON.

4. **Load the Unpacked Extension**:  
   - Click the **Load unpacked** button at the top-left of the Extensions page.
   - In the file dialog, navigate to the folder where you extracted the ZIP file.
   - Select the folder that contains the `manifest.json` file (this should be the root directory of the extension).

5. **Verify the Installation**:  
   After loading the extension, it will appear in the list of installed extensions and you should see its icon in the Chrome toolbar.

6. **Test the Extension**:  
   Navigate to the EECS 281 autograder, submit your project, and if all test cases pass, enjoy your well-deserved confetti celebration!

---

### Updating the Extension

If you make changes to the source code or download a new version:

1. Open the **Extensions** page (`chrome://extensions/`).
2. Click the **Reload** button (⟳) next to your extension to load the latest changes.

---

### Troubleshooting

If the confetti celebration doesn’t trigger:

- Make sure you have the **Developer mode** enabled on the **Extensions** page.
- Double-check that the `manifest.json` file is in the root folder you selected when loading the extension.
- Open Chrome Developer Tools (`Ctrl + Shift + J` or `Cmd + Option + J` on Mac) and check the **Console** tab for any error messages related to the extension.

---

### How It Works

This extension runs in the background on the EECS 281 autograder page and monitors the test results. When it detects that **all test cases have passed**, it triggers a confetti animation on the page to celebrate your success.

---

### Contributing

We welcome contributions! If you have ideas to improve the extension (e.g., adding more celebratory effects, fixing bugs, or optimizing the code), feel free to contribute.

To contribute:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a Pull Request and describe your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Have fun coding, and celebrate your EECS 281 victories with a confetti party! 🎉 If you need help, feel free to open an issue in this repository.

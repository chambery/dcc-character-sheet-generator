document.addEventListener('DOMContentLoaded', () => {
    const pdfSelect = document.getElementById('pdf-select')
    const canvas = document.getElementById('pdf-canvas')
    const ctx = canvas.getContext('2d')
    const pdfFileInput = document.getElementById('pdf-file-input') // Get the new file input
    const locationsList = document.getElementById('locations-list')

    let pdfDoc = null
    let currentPageNum = 1
    let pageRendering = false
    let pageNumPending = null
    const scale = 1.5 // Adjust for desired PDF rendering scale

    let recordedLocations = [] // To store { name, x, y, pdfName, pageNum }
    let currentPdfDisplayName = "N/A" // To store the name of the currently loaded PDF

    // --- IMPORTANT: Configure your available PDFs here ---
    // Place your PDF files in an 'assets' folder relative to index.html
    const availablePdfs = [
        { name: "Spaceship daskboard", url: "../assets/DCC_L0_4up_dashboard.pdf" },
        { name: "Sample PDF 2", url: "assets/sample2.pdf" },
        // Add more PDFs here: { name: "My Other PDF", url: "assets/my_other.pdf" }
    ]

    function populatePdfSelector() {
        availablePdfs.forEach(pdf => {
            const option = document.createElement('option')
            option.value = pdf.url
            option.textContent = pdf.name
            pdfSelect.appendChild(option)
        })

        if (availablePdfs.length > 0) {
            currentPdfDisplayName = availablePdfs[0].name
            loadPdf(availablePdfs[0].url)
        } else {
            console.warn("No PDFs configured in availablePdfs array in script.js")
            alert("Please configure PDF files in script.js")
        }
    }

    async function loadPdf(pdfUrl) {
        // pdfUrl can now be a path string or an Object URL from a local file
        try {
            const loadingTask = pdfjsLib.getDocument(pdfUrl)
            pdfDoc = await loadingTask.promise
            console.log('PDF loaded:', pdfUrl)
            currentPageNum = 1
            recordedLocations = [] // Clear locations for the new PDF
            updateLocationsDisplay()
            renderPage(currentPageNum)
        } catch (error) {
            console.error('Error loading PDF:', error)
            alert(`Failed to load PDF: ${pdfUrl}. Check console for details.`)
            pdfDoc = null // Ensure pdfDoc is null on failure
            // Clear canvas if PDF loading fails
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }

    async function renderPage(num) {
        if (!pdfDoc) return // Don't render if no PDF is loaded
        pageRendering = true
        document.getElementById('pdf-viewer').style.cursor = 'wait'


        try {
            const page = await pdfDoc.getPage(num)
            const viewport = page.getViewport({ scale: scale })
            canvas.height = viewport.height
            canvas.width = viewport.width

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            }
            await page.render(renderContext).promise
            console.log('Page rendered')
        } catch (error) {
            console.error('Error rendering page:', error)
            alert(`Failed to render page ${num}. Check console for details.`)
        } finally {
            pageRendering = false
            document.getElementById('pdf-viewer').style.cursor = 'crosshair'
            if (pageNumPending !== null) {
                renderPage(pageNumPending)
                pageNumPending = null
            }
        }
    }

    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num
        } else {
            renderPage(num)
        }
    }

    function updateLocationsDisplay() {
        locationsList.innerHTML = '' // Clear existing list
        recordedLocations.forEach(loc => {
            const listItem = document.createElement('li')
            // Displaying name, x, y. PDF name and page are stored but not shown here for simplicity.
            listItem.textContent = `"${loc.name}": { x: ${loc.x.toFixed(2)}, y: ${loc.y.toFixed(2)} } (Page ${loc.pageNum} of ${loc.pdfName})`
            locationsList.appendChild(listItem)
        })
    }

    // Event Listeners
    pdfSelect.addEventListener('change', (e) => {
        const selectedPdfUrl = e.target.value
        if (selectedPdfUrl) {
            currentPdfDisplayName = e.target.options[e.target.selectedIndex].text
            loadPdf(selectedPdfUrl)
            if (pdfFileInput) pdfFileInput.value = "" // Clear file input if a dropdown item is selected
        }
    })

    pdfFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.type === "application/pdf") {
                const fileUrl = URL.createObjectURL(file)
                currentPdfDisplayName = file.name // Use the actual file name
                loadPdf(fileUrl)
                pdfSelect.value = "" // Deselect any item in the dropdown
            } else {
                alert("Please select a valid PDF file.")
                event.target.value = "" // Clear the input
            }
        }
    })

    canvas.addEventListener('click', async (event) => {
        if (!pdfDoc) {
            alert("Please load a PDF first.")
            return
        }

        const rect = canvas.getBoundingClientRect()
        const canvasX = event.clientX - rect.left
        const canvasY = event.clientY - rect.top

        // Convert canvas coordinates to PDF page coordinates (origin top-left)
        // This assumes the canvas is rendered at the specified `scale`
        const pdfX = canvasX / scale
        const pdfY = canvasY / scale

        const name = prompt("Enter a name for this location:")
        if (name && name.trim() !== "") {
            const newLocation = {
                name: name.trim(),
                x: pdfX,
                y: pdfY,
                pdfName: currentPdfDisplayName, // Use the stored display name
                pageNum: currentPageNum
            }
            recordedLocations.push(newLocation)
            updateLocationsDisplay()
            console.log('Location added:', newLocation)
        } else if (name !== null) { // User entered empty string or only whitespace
            alert("Location name cannot be empty.")
        }
        // If name is null (user pressed Cancel), do nothing.
    })

    // Initial setup
    populatePdfSelector()
})

const ed = new Editor("editor");

// To activate editors's features, you just need to make an instance of the
// editor class. The only attribute is the ID of the core editor div.
// Structure of the editor+s elements in html:
// 
// div #EDTR-NAME
// └───div #EDTR-NAME_scroll
//     ├───div #EDTR-NAME_inner
//     ├───div #EDTR-NAME_rowline
//     └───div #EDTR-NAME_core
//         ├───textarea #EDTR-NAME_input
//         └───div #EDTR-NAME_rows
// 
// EDTR-NAME - ID of the core editor div
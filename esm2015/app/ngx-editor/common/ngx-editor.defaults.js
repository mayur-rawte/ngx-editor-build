/**
 * toolbar default configuration
 */
export const ngxEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    imageEndPoint: '',
    toolbar: [
        ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
        ['fontName', 'fontSize', 'color'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
        ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
        ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
        ['link', 'unlink', 'image', 'video'],
        ['code']
    ],
    headers: {},
    responseEndPoint: null,
    appendImageEndPointToResponse: true
};
/**
 * codemirror configuaration
 */
export const codeMirrorConfig = {
    lineNumbers: true,
    gutter: true,
    lineWrapping: true,
    mode: 'htmlmixed',
    autofocus: true,
    htmlMode: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5kZWZhdWx0cy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9jb21tb24vbmd4LWVkaXRvci5kZWZhdWx0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRztJQUM3QixRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE1BQU0sRUFBRSxNQUFNO0lBQ2QsU0FBUyxFQUFFLEdBQUc7SUFDZCxLQUFLLEVBQUUsTUFBTTtJQUNiLFFBQVEsRUFBRSxHQUFHO0lBQ2IsU0FBUyxFQUFFLEtBQUs7SUFDaEIsYUFBYSxFQUFFLElBQUk7SUFDbkIsV0FBVyxFQUFFLElBQUk7SUFDakIsV0FBVyxFQUFFLG9CQUFvQjtJQUNqQyxhQUFhLEVBQUUsRUFBRTtJQUNqQixPQUFPLEVBQUU7UUFDUCxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDO1FBQzVFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUM7UUFDakMsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztRQUNwRixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO1FBQ3pELENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsZUFBZSxDQUFDO1FBQ2pHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO1FBQ3BDLENBQUMsTUFBTSxDQUFDO0tBQ1Q7SUFDRCxPQUFPLEVBQUUsRUFBRTtJQUNYLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsNkJBQTZCLEVBQUUsSUFBSTtDQUNwQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRztJQUM5QixXQUFXLEVBQUUsSUFBSTtJQUNqQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0lBQ2xCLElBQUksRUFBRSxXQUFXO0lBQ2pCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsUUFBUSxFQUFFLElBQUk7Q0FDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiB0b29sYmFyIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY29uc3Qgbmd4RWRpdG9yQ29uZmlnID0ge1xuICBlZGl0YWJsZTogdHJ1ZSxcbiAgc3BlbGxjaGVjazogdHJ1ZSxcbiAgaGVpZ2h0OiAnYXV0bycsXG4gIG1pbkhlaWdodDogJzAnLFxuICB3aWR0aDogJ2F1dG8nLFxuICBtaW5XaWR0aDogJzAnLFxuICB0cmFuc2xhdGU6ICd5ZXMnLFxuICBlbmFibGVUb29sYmFyOiB0cnVlLFxuICBzaG93VG9vbGJhcjogdHJ1ZSxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciB0ZXh0IGhlcmUuLi4nLFxuICBpbWFnZUVuZFBvaW50OiAnJyxcbiAgdG9vbGJhcjogW1xuICAgIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3VwZXJzY3JpcHQnLCAnc3Vic2NyaXB0J10sXG4gICAgWydmb250TmFtZScsICdmb250U2l6ZScsICdjb2xvciddLFxuICAgIFsnanVzdGlmeUxlZnQnLCAnanVzdGlmeUNlbnRlcicsICdqdXN0aWZ5UmlnaHQnLCAnanVzdGlmeUZ1bGwnLCAnaW5kZW50JywgJ291dGRlbnQnXSxcbiAgICBbJ2N1dCcsICdjb3B5JywgJ2RlbGV0ZScsICdyZW1vdmVGb3JtYXQnLCAndW5kbycsICdyZWRvJ10sXG4gICAgWydwYXJhZ3JhcGgnLCAnYmxvY2txdW90ZScsICdyZW1vdmVCbG9ja3F1b3RlJywgJ2hvcml6b250YWxMaW5lJywgJ29yZGVyZWRMaXN0JywgJ3Vub3JkZXJlZExpc3QnXSxcbiAgICBbJ2xpbmsnLCAndW5saW5rJywgJ2ltYWdlJywgJ3ZpZGVvJ10sXG4gICAgWydjb2RlJ11cbiAgXSxcbiAgaGVhZGVyczoge30sXG4gIHJlc3BvbnNlRW5kUG9pbnQ6IG51bGwsXG4gIGFwcGVuZEltYWdlRW5kUG9pbnRUb1Jlc3BvbnNlOiB0cnVlXG59O1xuXG4vKipcbiAqIGNvZGVtaXJyb3IgY29uZmlndWFyYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGNvZGVNaXJyb3JDb25maWcgPSB7XG4gIGxpbmVOdW1iZXJzOiB0cnVlLFxuICBndXR0ZXI6IHRydWUsXG4gIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgbW9kZTogJ2h0bWxtaXhlZCcsXG4gIGF1dG9mb2N1czogdHJ1ZSxcbiAgaHRtbE1vZGU6IHRydWVcbn07XG4iXX0=
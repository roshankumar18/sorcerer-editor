import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, Modifier, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './style.css'

//Customer Style for Red color
const customStyleMap = {
  RED:{
    color:'red',
  }
}

const MyEditor = () => {
  
  const [editorState, setEditorState] = useState(() => {
    const rawContent = localStorage.getItem('state')
    return rawContent ? EditorState.createWithContent(convertFromRaw(JSON.parse(rawContent))) : EditorState.createEmpty()
  });

  
  //handle markdown 
  const handleBeforeInput = (character, editorState) => {
    const currentContentState = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const currentBlock = currentContentState.getBlockForKey(currentSelection.getStartKey())
    const offset = currentSelection.getStartOffset();
    const currentText = currentBlock.getText();
    
    let contentState=null
    
    //Checked all conditions
    if(currentText.startsWith('* ') && offset ===2 ){
      contentState = RichUtils.toggleInlineStyle(editorState,'BOLD') 
    }else if(currentText.startsWith('** ') && offset===3){
      contentState = RichUtils.toggleInlineStyle(editorState,'RED') 
    }else if(currentText.startsWith('*** ') && offset===4){
      contentState = RichUtils.toggleInlineStyle(editorState,'UNDERLINE') 
    }else if(currentText.startsWith('# ') && offset===2){
      contentState = RichUtils.toggleBlockType(editorState,'header-one') 
    }
    if(contentState){
      const newSelection = currentSelection.merge({
        anchorOffset: 0,
        focusOffset: offset,
      }); 
      const newContentState = Modifier.replaceText(contentState.getCurrentContent(),newSelection)
      let newState = EditorState.push(contentState, newContentState, 'change-block-type');
      setEditorState(newState)
      return 'handled'
    }
     
    return 'not-handled'

   
  };

  //handled keyboard commands
  const handleKeyCommand = (command,editorState) =>{
    const state = RichUtils.handleKeyCommand(editorState,command)
    if(state){
      setEditorState(state)
      return 'handled'
    }
    return 'not-handled'
      
  }

  //Store content in local storage when save is clicked
  const storeEditor = () =>{
    localStorage.setItem('state',
      JSON.stringify(convertToRaw(editorState.getCurrentContent())) )
      alert('Saved')
  }
  

  return (
    <div className="app ">
        <header className='header '>
            <p className='p'>Demo editor by <span>Roshan</span></p>
            <button className='button' onClick={storeEditor}>Save</button>
        </header>
      <div  className='editor'>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={customStyleMap}
          placeholder='Tell a story'
          />
      </div>

   </div>
      
    
  )
}

export default MyEditor
import Globals from '../../Globals';



export default class CustomInput {
    id = Date.now();
    text = '';
    fontFamily = Globals.font.family.bold;
    fontSize = Globals.font.size.xlarge;
    textAlign = 'left';
    color = Globals.color.text.light;
    backgroundColor = null;
    rotation = 0;
    scale = 1;
    x = 0;
    y = 0;
}
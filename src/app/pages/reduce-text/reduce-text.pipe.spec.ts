import { ReduceTextPipe } from "./reduce-text.pipe";


describe('reduce text pipe',()=>{
    let pipe: ReduceTextPipe;

    beforeEach(()=>{
        pipe = new ReduceTextPipe();
    });

    it('should create', ()=>{
        expect(pipe).toBeTruthy();
    });

    fit('use transform correctrly',()=>{
        const text = 'Hello word, it is the text to check de pipe';
        const newText = pipe.transform(text,5);
        expect(newText.length).toBe(5);
    });
});
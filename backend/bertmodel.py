from transformers import BertTokenizer, TFBertModel

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
text_encoder = TFBertModel.from_pretrained('bert-base-uncased')

def encode_text(text):
    inputs = tokenizer(text, return_tensors='tf', padding=True, truncation=True)
    outputs = text_encoder(inputs)
    return outputs.last_hidden_state[:, 0, :]